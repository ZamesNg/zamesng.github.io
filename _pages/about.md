---
layout: default
title: Home
permalink: /
---

<link rel="stylesheet" href="{{ '/assets/css/personal.css' | relative_url }}">

<style>
.home-intro { display: grid; grid-template-columns: minmax(0, 1fr) 30%; grid-template-areas: "heading portrait" "bio portrait"; column-gap: 1.5rem; align-items: start; }
.home-heading { grid-area: heading; }
.home-heading h1 { margin: 0 0 0.5rem; }
.home-heading .desc { margin-bottom: 1rem; }
.home-bio { grid-area: bio; min-width: 0; }
.home-profile { grid-area: portrait; width: 100%; margin: 0 0 1rem; }
.profile-links a:focus-visible { outline: 2px solid var(--global-theme-color); outline-offset: 2px; }
.home-publications.publications { margin-top: 0.5rem; }
.home-selected-heading { margin-bottom: 0.5rem; }
@media (max-width: 575px) {
 .home-intro { grid-template-columns: minmax(0, 1fr); grid-template-areas: "heading" "portrait" "bio"; }
 .home-profile { width: min(100%, 300px); justify-self: center; }
}
</style>

<div class="post">
<div class="home-intro">
<header class="home-heading">
<h1 class="post-title">{{ site.title }}</h1>
<p class="desc">PhD Candidate · Department of Mechanical Engineering<br>City University of Hong Kong · Hong Kong SAR, China</p>
</header>
<div class="profile home-profile">
  <div class="rounded z-depth-1" style="position: relative; aspect-ratio: 4 / 5; overflow: hidden;">
    <img src="{{ '/assets/img/zeming-wu.jpg' | relative_url }}" alt="Zeming Wu beside the coast" width="2080" height="3120" style="position: absolute; width: 260%; max-width: none; height: auto; left: -75%; top: -115%;">
  </div>
  <nav class="profile-links" aria-label="Contact and academic profiles" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem; margin-top: 0.6rem; font-size: 1.5rem;">
    <a href="mailto:{{ site.data.socials.email }}" aria-label="Email" title="Email" style="display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin: 0; padding: 0; border-radius: 0.25rem; font-size: inherit;"><i class="fa-solid fa-envelope" aria-hidden="true"></i></a>
    <a href="https://scholar.google.com/citations?user={{ site.data.socials.scholar_userid }}" aria-label="Google Scholar" title="Google Scholar" style="display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin: 0; padding: 0; border-radius: 0.25rem; font-size: inherit;"><i class="ai ai-google-scholar" aria-hidden="true"></i></a>
    <a href="https://github.com/{{ site.data.socials.github_username }}" aria-label="GitHub" title="GitHub" style="display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin: 0; padding: 0; border-radius: 0.25rem; font-size: inherit;"><i class="fa-brands fa-github" aria-hidden="true"></i></a>
    <a href="https://www.linkedin.com/in/{{ site.data.socials.linkedin_username }}" aria-label="LinkedIn" title="LinkedIn" style="display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin: 0; padding: 0; border-radius: 0.25rem; font-size: inherit;"><i class="fa-brands fa-linkedin" aria-hidden="true"></i></a>
    <a href="https://orcid.org/{{ site.data.socials.orcid_id }}" aria-label="ORCID" title="ORCID" style="display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin: 0; padding: 0; border-radius: 0.25rem; font-size: inherit;"><i class="ai ai-orcid" aria-hidden="true"></i></a>
    <a href="{{ site.data.socials.cv_pdf | relative_url }}" aria-label="Download CV" title="Download CV" style="display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; margin: 0; padding: 0; border-radius: 0.25rem; font-size: inherit;"><i class="ai ai-cv" aria-hidden="true"></i></a>
  </nav>
</div>

<div class="home-bio" markdown="1">
I am a third-year PhD candidate in the Department of Mechanical Engineering at
[City University of Hong Kong](https://www.cityu.edu.hk/), advised by
[Prof. Lu Liu](https://www.cityu.edu.hk/mne/people/academic-staff/mne-faculty/prof-liu-lu).

**I develop optimization-based methods that enable robots to plan and coordinate their motions safely and efficiently.**
My research connects distributed optimization, geometry-aware collision avoidance, and trajectory optimization,
with particular attention to robot shape, computational efficiency, and coordination among heterogeneous robots.

I received my B.Sc. in Automation and M.Sc. in Control Science and Engineering from
[Tongji University](https://www.tongji.edu.cn/) in 2021 and 2024, respectively.
During my master's studies, I worked in the [IVCM lab](https://ivcm.tongji.edu.cn/index.htm),
supervised by [Prof. Zhuping Wang](https://ivcm.tongji.edu.cn/info/1100/1178.htm) and working closely with
[Prof. Hao Zhang](https://ivcm.tongji.edu.cn/info/1100/1273.htm).

Explore my [research]({{ '/research/' | relative_url }}), browse the
[complete publication list]({{ '/publications/' | relative_url }}), or download my
[academic CV]({{ '/assets/pdf/zeming-wu-cv.pdf' | relative_url }}).
</div>
</div>

<aside class="personal-block" aria-labelledby="collaborations-heading">
  <h2 id="collaborations-heading"><i class="fa-solid fa-handshake" aria-hidden="true"></i>Open to research collaborations</h2>
  <p style="margin: 0;">I welcome collaborations in distributed optimization, trajectory optimization, motion planning, and multi-agent systems—especially projects connecting geometry-aware collision avoidance with efficient coordination of heterogeneous robots.</p>
</aside>

<section class="personal-block" aria-labelledby="reviewers-heading">
  <h2 id="reviewers-heading"><i class="fa-solid fa-mug-hot" aria-hidden="true"></i>Information for reviewers</h2>
  <p>I know that my work is not perfect, and I appreciate the time and care that reviewers put into improving it. Once a paper’s review process is complete, I would be glad to discuss its strengths and limitations with anyone who helped review it. As a small thank-you for your service, I would be happy to treat you to a drink or lunch. <strong>Meet me in person (e.g., at a conference) to redeem this offer!</strong></p>
</section>

<h2 class="home-selected-heading"><a href="{{ '/publications/' | relative_url }}" style="color: inherit;">Selected publications</a></h2>
<div class="publications home-publications">
{% bibliography --group_by none --query @*[selected=true]* %}
</div>

<section class="thesis-section" aria-labelledby="thesis-heading">
<h2 id="thesis-heading" class="home-selected-heading">Master’s Thesis</h2>
<div class="thesis-preview-layout">
<a class="thesis-preview" href="{{ '/research/#master-thesis' | relative_url }}" aria-label="Explore the master’s thesis: Formation Navigation in Cluttered Environments">
<img src="{{ '/assets/img/thesis_structure.png' | relative_url }}" alt="Thesis framework covering geometry-aware collision avoidance, bearing-constrained formation planning, and potential-game task assignment" width="2000" height="1482" loading="lazy">
</a>
<div class="thesis-preview-text">
<h3 class="thesis-title"><a href="{{ '/research/#master-thesis' | relative_url }}">Formation Navigation in Cluttered Environments</a></h3>
<p class="thesis-meta">Zeming Wu · Tongji University · 2024<br>Supervisor: <a href="{{ site.data.coauthors.wang[0].url }}">Prof. Zhuping Wang</a></p>
<p>This thesis develops optimization-based methods for multi-robot formation navigation in cluttered environments. It combines geometry-aware collision avoidance for individual robots, bearing-constrained trajectory optimization for coordinated formations, and distributed task assignment based on exact potential games to resolve deadlocks. Simulations and hardware experiments evaluate the resulting planning and coordination methods.</p>
<p><a href="{{ '/assets/pdf/master-thesis.pdf' | relative_url }}" download>Download thesis in Chinese (PDF)</a> · 31 MB</p>
</div>
</div>
</section>
</div>
