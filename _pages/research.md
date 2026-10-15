---
layout: page
permalink: /research/
title: Research
description: Distributed optimization, geometry-aware collision avoidance, and motion planning.
nav: true
nav_order: 1
---

<link rel="stylesheet" href="{{ '/assets/css/personal.css' | relative_url }}">

<div class="research-overview" markdown="1">
## Research overview

I develop optimization-based methods for safe and efficient robot motion, connecting distributed
optimization, geometry-aware collision avoidance, and trajectory generation for multi-agent systems.

</div>

<section class="research-paper" aria-labelledby="tro-2026">
<h2 id="tro-2026">Cooperative Geometry-Aware Collision Avoidance for Heterogeneous Robots Via Negotiation on Separating Hyperplanes</h2>
<p><strong>IEEE Transactions on Robotics (T-RO), 2026</strong></p>
<p>I develop a distributed cooperative-planning framework for heterogeneous robots using geometry-aware collision constraints. Separating hyperplanes provide a negotiation mechanism between robots, while ADMM, dimension reduction, and block coordinate descent distribute and accelerate the computation. The method is evaluated through numerical simulations, hardware experiments, and benchmark comparisons.</p>
<div class="research-video">
  <video controls playsinline preload="none" poster="{{ '/assets/img/research/tro-2026-poster.jpg' | relative_url }}" aria-label="Video accompanying the IEEE Transactions on Robotics (T-RO), 2026 paper" style="display: block; width: 100%; height: auto; margin-top: 0.5rem; border-radius: 0.25rem;">
    <source src="{{ '/assets/video/web/tro-2026.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. <a href="{{ '/assets/video/web/tro-2026.mp4' | relative_url }}">Open the video</a>.
  </video>
</div>
<p class="research-links"><a href="https://doi.org/10.1109/TRO.2026.3742236">DOI / publisher</a> · <a href="{{ '/assets/pdf/tro-2026-accepted.pdf' | relative_url }}">Accepted manuscript (PDF)</a></p>
</section>

<section class="research-paper" aria-labelledby="ral-2024">
<h2 id="ral-2024">Quaternion-Based Optimal Interpolation of Similarity Transformations for Multi-Agent Formation</h2>
<p><strong>IEEE Robotics and Automation Letters (RA-L), 2024</strong></p>
<p>I use quaternion-based representations to generate coordinated formation motions through optimal interpolation of similarity transformations. The formulation addresses distance, energy, and smoothness objectives, with polynomial approximation used to reduce computation while preserving the structure of the optimal trajectory.</p>
<figure style="margin: 1.25rem auto; max-width: 100%;">
  <img src="{{ '/assets/img/research/ral-formation.png' | relative_url }}" alt="Ellipsoid formation changing position, scale, and orientation along a time axis" class="img-fluid rounded" style="width: 100%; height: auto;" loading="lazy">
  <figcaption>Numerical illustration: interpolation of similarity transformations generates a sequence of coordinated formation shapes.</figcaption>
</figure>
<p class="research-links"><a href="https://doi.org/10.1109/LRA.2024.3396662">DOI / publisher</a> · <a href="{{ '/assets/pdf/ral-2024-accepted.pdf' | relative_url }}">Accepted manuscript (PDF)</a></p>
</section>

<section class="research-paper" aria-labelledby="iros-2025">
<h2 id="iros-2025">Collision-free Control Barrier Functions for General Ellipsoids via Separating Hyperplane</h2>
<p><strong>IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), 2025</strong></p>
<p>I construct geometry-aware control barrier functions for general ellipsoids using separating hyperplanes and dual cones. The analytical formulation avoids an additional optimization layer for evaluating the barrier functions, leaving a single-level control optimization. Numerical simulations and Robotarium hardware experiments demonstrate the approach.</p>
<div class="research-video">
  <video controls playsinline preload="none" poster="{{ '/assets/img/research/iros-2025-poster.jpg' | relative_url }}" aria-label="Video accompanying the IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), 2025 paper" style="display: block; width: 100%; height: auto; margin-top: 0.5rem; border-radius: 0.25rem;">
    <source src="{{ '/assets/video/web/iros-2025.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. <a href="{{ '/assets/video/web/iros-2025.mp4' | relative_url }}">Open the video</a>.
  </video>
</div>
<p class="research-links"><a href="https://doi.org/10.1109/IROS60139.2025.11247279">DOI / publisher</a> · <a href="{{ '/assets/pdf/iros-2025-accepted.pdf' | relative_url }}">Accepted manuscript (PDF)</a> · <a href="https://arxiv.org/abs/2505.20847">arXiv</a></p>
</section>

<section class="research-paper" aria-labelledby="icra-2024">
<h2 id="icra-2024">GPU-Accelerated Optimization-Based Collision Avoidance</h2>
<p><strong>IEEE International Conference on Robotics and Automation (ICRA), 2024</strong></p>
<p>I formulate geometry-aware collision-avoidance constraints for objects represented by unions of convex polyhedra. An ADMM-based decomposition separates the optimization into smaller quadratic programs that can be solved in parallel on GPUs. High-fidelity quadrotor simulations evaluate the method’s computational efficiency and collision-avoidance performance.</p>
<div class="research-video">
  <video controls playsinline preload="none" poster="{{ '/assets/img/research/icra-2024-poster.jpg' | relative_url }}" aria-label="Video accompanying the IEEE International Conference on Robotics and Automation (ICRA), 2024 paper" style="display: block; width: 100%; height: auto; margin-top: 0.5rem; border-radius: 0.25rem;">
    <source src="{{ '/assets/video/web/icra-2024.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. <a href="{{ '/assets/video/web/icra-2024.mp4' | relative_url }}">Open the video</a>.
  </video>
</div>
<p class="research-links"><a href="https://doi.org/10.1109/ICRA57147.2024.10610871">DOI / publisher</a> · <a href="{{ '/assets/pdf/icra-2024-accepted.pdf' | relative_url }}">Accepted manuscript (PDF)</a> · <a href="https://arxiv.org/abs/2406.07048">arXiv</a></p>
</section>

<section class="research-paper" aria-labelledby="tii-2024">
<h2 id="tii-2024">Local-Bearing-Based Prescribed-Time Distributed Localization of Multiagent Systems With Noisy Measurement</h2>
<p><strong>IEEE Transactions on Industrial Informatics (TII), 2024</strong></p>
<p>This work studies distributed localization of multi-agent systems using local bearing measurements, with prescribed-time convergence in the presence of measurement noise.</p>
<p class="research-links"><a href="https://doi.org/10.1109/TII.2024.3383518">DOI / publisher</a></p>
</section>

<section class="research-paper" aria-labelledby="tcyb-2026">
<h2 id="tcyb-2026">Decentralized Pursuit of an Evader With Probabilistic Collision-Free for Differential Drive Robots</h2>
<p><strong>IEEE Transactions on Cybernetics (TCYB), 2026</strong></p>
<p>This collaborative work addresses decentralized pursuit under perception uncertainty. Chance-constrained pursuit Voronoi cells and a distributed control policy support probabilistic collision avoidance for differential-drive robots, with validation through simulations and experiments.</p>
<p class="research-links"><a href="https://doi.org/10.1109/TCYB.2026.3670025">DOI / publisher</a></p>
</section>

<h1 class="thesis-section-heading">Thesis</h1>
<section class="research-thesis thesis-card" aria-labelledby="master-thesis">
<h2 id="master-thesis">Formation Navigation in Cluttered Environments</h2>
<p class="thesis-meta"><strong>Master’s thesis · Tongji University · 2024</strong><br>Zeming Wu<br>Supervisor: <a href="{{ site.data.coauthors.wang[0].url }}">Prof. Zhuping Wang</a></p>
<p>This thesis develops optimization-based methods for multi-robot formation navigation in cluttered environments. It combines geometry-aware collision avoidance for individual robots, bearing-constrained trajectory optimization for coordinated formations, and distributed task assignment based on exact potential games to resolve deadlocks. Simulations and hardware experiments evaluate the resulting planning and coordination methods.</p>
<figure class="thesis-structure">
<img src="{{ '/assets/img/thesis_structure.png' | relative_url }}" alt="Three-part thesis framework: geometry-aware collision avoidance with GPU-accelerated optimization, bearing-constrained formation trajectory planning, and potential-game task assignment with deadlock resolution; validated in simulations and quadrotor experiments" width="2000" height="1482" loading="lazy">
<figcaption>Thesis structure (original Chinese labels): geometry-aware collision avoidance for individual robots; bearing-constrained formation trajectory optimization; and potential-game task assignment to resolve deadlocks. Validation includes AirSim simulations, numerical formation simulations, and Crazyflie hardware experiments.</figcaption>
</figure>
<p class="research-links"><a href="{{ '/assets/pdf/master-thesis.pdf' | relative_url }}" download>Download thesis in Chinese (PDF)</a> · 31 MB</p>
</section>

---

For full citations and author lists, see my [publications]({{ '/publications/' | relative_url }}).
I welcome research discussions about optimization-based planning and coordination:
[zeming.wu@my.cityu.edu.hk](mailto:zeming.wu@my.cityu.edu.hk).
