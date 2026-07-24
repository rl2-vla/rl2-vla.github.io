"""
RL2-VLA hero video (v2) — real footage + friendly compositional-steering story.

Storyboard (~30s, 16:9, light/paper theme, 30fps):
  1. INTRO   : real robot clip + SAFE failure-prediction plot play side by side.
  2. FAILURE : plot crosses the band -> "SAFE predicts a failure"; both clips
               shrink to a frozen corner thumbnail.
  3. MIDDLE  : friendly, word-based flow-matching. A blue "base VLA" plan drifts
               into a red FAILURE zone; green "RL steering" pulls back; blending
               both, step by step, denoises the action OUT of failure INTO the
               green SUCCESS zone (dots color-heal blue -> green).
  4. OUTRO   : clips resume — the failure score drops below the band and the arm
               places the tape in the toolbox. "Failure avoided — task succeeds."

Video frames are decoded with PyAV and shown via an ImageMobject whose
`pixel_array` is swapped in place by an updater (validated frame-swap approach).

Render (uv at ~/.local/bin/uv, TeX at /Library/TeX/texbin):
    PATH="/Library/TeX/texbin:$PATH" uv run manim --fps 30 -ql main.py RL2Hero
    PATH="/Library/TeX/texbin:$PATH" uv run manim --fps 30 -qh main.py RL2Hero
"""

import av
import numpy as np
from PIL import Image
from manim import *

# --- Light / paper theme (16:9 default) --------------------------------------
config.background_color = "#F9F9F7"

# Site palette
INK     = "#111111"
GREEN   = "#1A8341"   # RL steering / success / brand
BLUE    = "#1C6488"   # base VLA
CYAN    = "#29A9DF"
TEAL    = "#0FB5AE"   # blended action
GRAY    = "#525252"
GOLD    = "#E27B33"
REDX    = "#B91C1C"   # failure
FAINT   = "#D8D8D2"
FAIL_BG = "#FBE3E0"
WIN_BG  = "#DCF3E4"

VIDEO_DIR = ("/Users/krishnaiyer/Workspace/rl2-vla-private/assets/videos/"
             "ood_env/real/tape_in_toolbox/")
ROBOT = VIDEO_DIR + "ADAPTIVE_COMPOSE_s7_episode_6_success_True_raw_camera_left_13s.mp4"
PLOT = VIDEO_DIR + "ADAPTIVE_COMPOSE_TAPE_episode_6_success_True_failure_prediction_plot (1).mp4"


def load_frames(path, start_s, end_s, n_out, out_w):
    """Decode [start_s, end_s], evenly sample n_out frames, resize to out_w, RGBA uint8."""
    container = av.open(path)
    stream = container.streams.video[0]
    fps = float(stream.average_rate)
    want = sorted({int(round((start_s + (end_s - start_s) * i / max(1, n_out - 1)) * fps))
                   for i in range(n_out)})
    last = want[-1]
    grabbed = {}
    for i, frame in enumerate(container.decode(stream)):
        if i in grabbed or i > last:
            if i > last:
                break
            continue
        if i in want:
            img = frame.to_image()
            w, h = img.size
            out_h = int(round(out_w * h / w))
            img = img.resize((out_w, out_h), Image.LANCZOS).convert("RGBA")
            grabbed[i] = np.asarray(img, dtype=np.uint8)
        if i >= last:
            break
    container.close()
    return [grabbed[i] for i in want if i in grabbed]


def field_to(target, k=0.9):
    t = np.array(target, dtype=float)
    return lambda p: k * (t - p)


# ---- Middle-section geometry (absolute scene coords, inside the canvas) -----
MID_NOISE = np.array([-5.2, 0.0, 0.0])
MID_A = np.array([0.2, -1.3, 0.0])     # base-VLA endpoint -> failure zone
MID_S = np.array([-1.0, 0.7, 0.0])     # success (tape in toolbox)
MID_R = 2 * MID_S - MID_A              # RL attractor: equal blend -> success
v_vla = field_to(MID_A)
v_rl = field_to(MID_R)


class RL2Hero(Scene):
    def construct(self):
        np.random.seed(7)
        # Decode all clips up front (fail fast; ~0.5GB held for the render).
        self.robot_in = load_frames(ROBOT, 0.0, 7.0, 90, 760)
        self.plot_in = load_frames(PLOT, 0.0, 5.0, 90, 560)
        self.robot_out = load_frames(ROBOT, 7.0, 13.6, 110, 760)
        self.plot_out = load_frames(PLOT, 8.0, 15.0, 110, 560)

        self._add_watermark()
        self._intro()
        self._failure_and_shrink()
        self._middle()
        self._outro()

    # -- helpers ---------------------------------------------------------------
    def _clip(self, frames, width):
        img = ImageMobject(frames[0]).scale_to_fit_width(width)
        ft = ValueTracker(0)
        img.add_updater(lambda m: setattr(
            m, "pixel_array", frames[min(int(ft.get_value()), len(frames) - 1)]))
        return img, ft

    def _caption(self, text, color=INK, run_time=0.45):
        cap = Text(text, font_size=30, color=color, weight=BOLD).to_edge(DOWN, buff=0.4)
        old = getattr(self, "_cap", None)
        if old is not None and old in self.mobjects:
            self.play(FadeOut(old, run_time=0.25), FadeIn(cap, run_time=run_time))
        else:
            self.play(FadeIn(cap, shift=UP * 0.15, run_time=run_time))
        self._cap = cap
        return cap

    def _flow_cloud(self, cloud, funcs, duration, speed, heal=False):
        """Advance each dot's center along its field (per-dot updater; runs during wait)."""
        if callable(funcs):
            funcs = [funcs] * len(cloud)
        for d, f in zip(cloud, funcs):
            def u(dd, dt, _f=f):
                dd.shift(_f(dd.get_center()) * dt * speed)
            d.add_updater(u)
        if heal:
            # color-heal blue -> green over the flow duration
            healer = ValueTracker(0)
            for d in cloud:
                d.add_updater(lambda dd: dd.set_color(
                    interpolate_color(ManimColor(BLUE), ManimColor(GREEN), healer.get_value())))
            self.play(healer.animate.set_value(1.0), run_time=duration, rate_func=linear)
            for d in cloud:
                d.clear_updaters()
        else:
            self.wait(duration)
            for d in cloud:
                d.clear_updaters()

    def _add_watermark(self):
        lock = MathTex(r"\mathrm{RL}^2", r"\text{-VLA}", font_size=40)
        lock[0].set_color(GREEN)
        lock[1].set_color(GRAY)
        lock.to_corner(UL, buff=0.35)
        self.add(lock)
        self.watermark = lock

    # ------------------------------------------------------------------ 1 ----
    def _intro(self):
        title = Text("Task:  put the tape in the toolbox", font_size=32, color=INK,
                     weight=BOLD).to_edge(UP, buff=0.32)

        robot, self.r_ft = self._clip(self.robot_in, 7.0)
        robot.move_to([-3.25, -0.35, 0])
        plot, self.p_ft = self._clip(self.plot_in, 3.95)
        plot.move_to([4.0, -0.35, 0])
        r_lbl = Text("Robot camera", font_size=22, color=GRAY).next_to(robot, UP, buff=0.14)
        p_lbl = Text("SAFE failure monitor", font_size=22, color=GRAY).next_to(plot, UP, buff=0.14)

        self.robot, self.plot = robot, plot
        self.intro_labels = VGroup(title, r_lbl, p_lbl)

        self.play(FadeIn(title, shift=DOWN * 0.15), run_time=0.5)
        self.add(robot, plot)
        self.play(FadeIn(robot), FadeIn(plot), FadeIn(r_lbl), FadeIn(p_lbl), run_time=0.5)
        # Play both clips (sped up: 7s->3s robot, 5s->3s plot)
        self.play(self.r_ft.animate.set_value(len(self.robot_in) - 1),
                  self.p_ft.animate.set_value(len(self.plot_in) - 1),
                  rate_func=linear, run_time=3.0)

    # ------------------------------------------------------------------ 2 ----
    def _failure_and_shrink(self):
        flash = SurroundingRectangle(self.plot, color=REDX, buff=0.04,
                                     stroke_width=6, corner_radius=0.1)
        self._caption("SAFE predicts a failure", color=REDX)
        self.play(Create(flash), run_time=0.4)
        self.wait(0.2)

        # Shrink robot + plot to a frozen thumbnail, top-right.
        pip = Group(self.robot, self.plot, flash)
        self.pip = pip
        self.play(FadeOut(self.intro_labels),
                  pip.animate.scale(0.30).to_corner(UR, buff=0.28),
                  FadeOut(self._cap),
                  run_time=0.8)
        self._cap = None

    # ------------------------------------------------------------------ 3 ----
    def _middle(self):
        canvas = RoundedRectangle(corner_radius=0.3, width=8.0, height=5.9,
                                  stroke_color=FAINT, stroke_width=2.5,
                                  fill_color=WHITE, fill_opacity=0.5).move_to([-2.0, 0.0, 0])
        self.canvas = canvas

        # Failure / success zones
        fail_zone = Ellipse(width=3.0, height=1.9, color=REDX, fill_color=FAIL_BG,
                            fill_opacity=0.9, stroke_width=2).move_to(MID_A + DOWN * 0.15)
        win_zone = Ellipse(width=3.2, height=1.9, color=GREEN, fill_color=WIN_BG,
                           fill_opacity=0.9, stroke_width=2).move_to(MID_S + UP * 0.15)
        fail_lbl = Text("FAILURE", font_size=20, color=REDX, weight=BOLD).move_to(MID_A + DOWN * 0.15)
        win_lbl = Text("SUCCESS", font_size=20, color=GREEN, weight=BOLD).move_to(win_zone.get_top() + DOWN * 0.28)

        # Success icon: green tape ring going into a red toolbox
        toolbox = RoundedRectangle(corner_radius=0.05, width=0.62, height=0.34, color=REDX,
                                   fill_color=REDX, fill_opacity=1, stroke_width=1)
        tape = Annulus(inner_radius=0.07, outer_radius=0.16, color=GREEN,
                       fill_color=GREEN, fill_opacity=1, stroke_width=0)
        goal = Group(toolbox, tape.next_to(toolbox, UP, buff=-0.02)).move_to(MID_S + DOWN * 0.15)

        self.play(FadeIn(canvas), run_time=0.5)
        self.play(FadeIn(fail_zone), FadeIn(win_zone), FadeIn(fail_lbl), FadeIn(win_lbl),
                  FadeIn(goal), run_time=0.7)

        # --- M2: base VLA plan drifts into failure --------------------------
        offs = np.random.randn(12, 3) * 0.28
        offs[:, 2] = 0
        vla_cloud = VGroup(*[Dot(MID_NOISE + o, radius=0.06, color=BLUE, fill_opacity=0.9)
                             for o in offs])
        vla_tag = Text("Base VLA", font_size=22, color=BLUE, weight=BOLD).next_to(vla_cloud, UP, buff=0.25)
        self.play(LaggedStart(*[GrowFromCenter(d) for d in vla_cloud], lag_ratio=0.05),
                  FadeIn(vla_tag), run_time=0.6)
        self._caption("The base model's plan drifts toward failure", color=BLUE)
        vla_tag.add_updater(lambda m: m.next_to(vla_cloud, UP, buff=0.25))
        self._flow_cloud(vla_cloud, v_vla, duration=1.7, speed=1.9)
        vla_tag.clear_updaters()
        xmark = Cross(scale_factor=0.22, stroke_color=REDX, stroke_width=6).move_to(MID_A)
        self.play(Create(xmark), run_time=0.4)
        self.vla_dead = VGroup(vla_cloud, vla_tag, xmark)

        # --- M3: RL steering + blend dial -----------------------------------
        self.play(FadeOut(vla_tag), vla_cloud.animate.set_opacity(0.22),
                  xmark.animate.set_opacity(0.5), run_time=0.3)
        self.vla_dead = VGroup(vla_cloud, xmark)
        rl_field = ArrowVectorField(
            v_rl, color=GREEN, x_range=[-5.4, 1.4, 1.0], y_range=[-2.2, 2.2, 1.0],
            length_func=lambda n: 0.28 * sigmoid(n), opacity=0.32,
        )
        rl_tag = Text("RL steering", font_size=22, color=GREEN, weight=BOLD)
        rl_tag.move_to([-4.3, 2.45, 0])
        self._caption("RL steering pushes back toward success", color=GREEN)
        self.play(FadeIn(rl_field), FadeIn(rl_tag), run_time=0.7)
        # keep zones/goal crisp above the field arrows
        self.bring_to_front(fail_zone, win_zone, fail_lbl, win_lbl, goal, rl_tag)

        dial = self._blend_dial().to_edge(RIGHT, buff=0.5).shift(DOWN * 1.1)
        self.play(FadeIn(dial), run_time=0.5)

        # --- M4: per-step blended denoising (hero dot, color-heal) ----------
        self._caption("Blend both, step by step")
        hero = Dot(MID_NOISE, radius=0.1, color=BLUE, z_index=6)
        prog = Text("Refining  1 / 5", font_size=22, color=INK).move_to(canvas.get_top() + DOWN * 0.35)
        self.play(FadeIn(hero, scale=0.5), FadeIn(prog), run_time=0.4)

        ALPHA, STEPS = 0.42, 5
        trail_pts = [MID_NOISE.copy()]
        trail = VMobject(stroke_color=TEAL, stroke_width=4)
        self.add(trail)
        p = MID_NOISE.copy()
        for i in range(STEPS):
            w = 0.5
            blue_c = ALPHA * w * (MID_A - p)
            green_c = ALPHA * (1 - w) * (MID_R - p)
            nxt = p + blue_c + green_c
            a_blue = Arrow(p, p + blue_c, color=BLUE, buff=0, stroke_width=5,
                           max_tip_length_to_length_ratio=0.4)
            a_green = Arrow(p + blue_c, nxt, color=GREEN, buff=0, stroke_width=5,
                            max_tip_length_to_length_ratio=0.4)
            a_blend = Arrow(p, nxt, color=TEAL, buff=0, stroke_width=7,
                            max_tip_length_to_length_ratio=0.34)
            anims = [LaggedStart(GrowArrow(a_blue), GrowArrow(a_green), GrowArrow(a_blend),
                                 lag_ratio=0.45)]
            if i == 0:
                lb = Text("VLA", font_size=16, color=BLUE).next_to(a_blue, DOWN, buff=0.05)
                lg = Text("RL", font_size=16, color=GREEN).next_to(a_green, RIGHT, buff=0.05)
                lt = Text("blend", font_size=16, color=TEAL).next_to(a_blend, UP, buff=0.05)
                mini = VGroup(lb, lg, lt)
                anims.append(FadeIn(mini))
            new_prog = Text(f"Refining  {i + 1} / 5", font_size=22, color=INK).move_to(prog)
            self.play(*anims, Transform(prog, new_prog), run_time=0.5)
            heal_col = interpolate_color(ManimColor(BLUE), ManimColor(GREEN), (i + 1) / STEPS)
            trail_pts.append(nxt.copy())
            new_trail = VMobject(stroke_color=TEAL, stroke_width=4).set_points_as_corners(trail_pts)
            outs = [FadeOut(a_blue), FadeOut(a_green), FadeOut(a_blend)]
            if i == 0:
                outs.append(FadeOut(mini))
            self.play(hero.animate.move_to(nxt).set_color(heal_col),
                      Transform(trail, new_trail), *outs, run_time=0.34)
            p = nxt

        self.play(hero.animate.move_to(MID_S).set_color(GREEN), FadeOut(prog), run_time=0.3)
        self._caption("The blended action escapes failure", color=GREEN)
        self.play(Flash(goal, color=GREEN, flash_radius=0.5), run_time=0.5)

        # --- M5: whole cloud lands in success -------------------------------
        offs2 = np.random.randn(14, 3) * 0.26
        offs2[:, 2] = 0
        cloud = VGroup(*[Dot(MID_NOISE + o, radius=0.055, color=BLUE, fill_opacity=0.9)
                         for o in offs2])
        self.play(LaggedStart(*[GrowFromCenter(d) for d in cloud], lag_ratio=0.03), run_time=0.5)
        ws = np.clip(np.random.normal(0.5, 0.2, size=14), 0.15, 0.85)
        funcs = [(lambda q, _w=wi: _w * v_vla(q) + (1 - _w) * v_rl(q)) for wi in ws]
        self._flow_cloud(cloud, funcs, duration=1.6, speed=1.9, heal=True)
        self.play(Flash(win_zone, color=GREEN, flash_radius=0.6), run_time=0.5)
        self.wait(0.3)

        self.middle_group = Group(
            canvas, fail_zone, win_zone, fail_lbl, win_lbl, goal, rl_field, rl_tag,
            dial, hero, trail, cloud, self.vla_dead,
        )

    def _blend_dial(self):
        track = RoundedRectangle(corner_radius=0.14, width=2.8, height=0.28,
                                 stroke_color=FAINT, stroke_width=2, fill_opacity=0)
        fill = Rectangle(width=1.4, height=0.28, stroke_width=0,
                         fill_color=TEAL, fill_opacity=0.55).align_to(track, LEFT)
        knob = Dot(track.get_center(), radius=0.12, color=TEAL)
        vla = Text("VLA", font_size=20, color=BLUE, weight=BOLD).next_to(track, LEFT, buff=0.2)
        rl = Text("RL", font_size=20, color=GREEN, weight=BOLD).next_to(track, RIGHT, buff=0.2)
        cap = Text("blend", font_size=18, color=GRAY).next_to(track, UP, buff=0.12)
        return VGroup(track, fill, knob, vla, rl, cap)

    # ------------------------------------------------------------------ 4 ----
    def _outro(self):
        self.play(FadeOut(self.middle_group), FadeOut(self.pip), run_time=0.5)

        robot, r_ft = self._clip(self.robot_out, 7.0)
        robot.move_to([-3.25, -0.35, 0])
        plot, p_ft = self._clip(self.plot_out, 3.95)
        plot.move_to([4.0, -0.35, 0])
        r_lbl = Text("Robot camera", font_size=22, color=GRAY).next_to(robot, UP, buff=0.14)
        p_lbl = Text("SAFE failure monitor", font_size=22, color=GRAY).next_to(plot, UP, buff=0.14)

        self.add(robot, plot)
        self.play(FadeIn(robot), FadeIn(plot), FadeIn(r_lbl), FadeIn(p_lbl), run_time=0.5)
        self._caption("Failure avoided — the task succeeds", color=GREEN)
        self.play(r_ft.animate.set_value(len(self.robot_out) - 1),
                  p_ft.animate.set_value(len(self.plot_out) - 1),
                  rate_func=linear, run_time=3.4)

        check = Text("✓", font_size=60, color=GREEN, weight=BOLD).move_to(robot.get_corner(DR) + LEFT * 0.6 + UP * 0.5)
        self.play(FadeIn(check, scale=0.5), Flash(check, color=GREEN, flash_radius=0.5), run_time=0.6)
        self.wait(1.0)
