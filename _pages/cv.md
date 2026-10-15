---
layout: default
permalink: /cv/
title: CV
nav: true
nav_order: 3
scholar:
  bibliography_template: |
    <div id="{{ entry.key }}" class="cv-citation">
      <div class="author">
        {%- for author in entry.author_array -%}
          {%- unless forloop.first -%}, {% endunless -%}
          {%- assign coauthor_key = author.last | downcase -%}
          {%- assign coauthor_url = nil -%}
          {%- for coauthor in site.data.coauthors[coauthor_key] -%}
            {%- if coauthor.firstname contains author.first -%}
              {%- assign coauthor_url = coauthor.url -%}
              {%- break -%}
            {%- endif -%}
          {%- endfor -%}
          {%- if author.first == 'Zeming' and author.last == 'Wu' -%}
            <em>{{ author.first }} {{ author.last }}</em>
          {%- elsif coauthor_url -%}
            <a href="{{ coauthor_url }}">{{ author.first }} {{ author.last }}</a>
          {%- else -%}
            {{ author.first }} {{ author.last }}
          {%- endif -%}
          {%- if entry['author+an'] contains 'equal' and forloop.index <= 2 -%}<sup>†</sup>{%- endif -%}
        {%- endfor -%}.
      </div>
      <div class="title">{{ entry.title }}.</div>
      <div class="periodical"><em>{% if entry.journal %}{{ entry.journal }}{% else %}{{ entry.booktitle }}{% endif %}</em>{% if entry.volume %}, vol. {{ entry.volume }}{% endif %}{% if entry.number %}, no. {{ entry.number }}{% endif %}{% if entry.address %}, {{ entry.address }}{% endif %}{% if entry.publisher %}: {{ entry.publisher }}{% endif %}{% if entry.pages %}, pp. {{ entry.pages | replace: '--', '–' }}{% endif %}, {% if entry.month %}{{ entry.month | capitalize }} {% endif %}{{ entry.year }}.</div>
      {% if entry.additional_info %}<div class="periodical">{{ entry.additional_info | markdownify }}</div>{% endif %}
      <div class="cv-citation-links">DOI: <a href="https://doi.org/{{ entry.doi }}">{{ entry.doi }}</a>{% if entry.pdf %} · <a href="{{ entry.pdf | prepend: '/assets/pdf/' | relative_url }}">Manuscript PDF</a>{% endif %}{% if entry.video %} · <a href="{{ entry.video | relative_url }}">Video</a>{% endif %}{% if entry.arxiv %} · <a href="https://arxiv.org/abs/{{ entry.arxiv }}">arXiv</a>{% endif %}</div>
    </div>
---

<link rel="stylesheet" href="{{ '/assets/css/personal.css' | relative_url }}">

<style>
.cv-page-heading { display: flex; align-items: baseline; gap: 12px; margin-bottom: 1.5rem; }
.cv-page-heading .post-title { margin: 0; }
.web-cv h2 { font-size: 1.5rem; border-bottom: 1px solid var(--global-divider-color); padding-bottom: 0.35rem; margin: 1.5rem 0 0.65rem; }
.cv-header { display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; }
.cv-header > div { display: flex; flex-direction: column; justify-content: space-between; min-height: 200px; }
.cv-header p { margin: 0; }
.cv-header h2 { margin: 0; border: 0; padding: 0; line-height: 1; }
.cv-header img { width: 160px; height: 200px; flex-shrink: 0; object-fit: cover; border-radius: 0.25rem; }
.cv-entry + .cv-entry { margin-top: 20px; }
.cv-entry-heading { display: flex; flex-wrap: wrap; justify-content: space-between; column-gap: 1rem; }
.cv-entry p { margin: 0.15rem 0 0; }
.cv-date, .cv-ranking-note { color: var(--global-text-color-light); font-size: 0.9rem; }
.web-cv .publications { margin-top: 0.5rem; }
.web-cv .publications h3 { font-size: 1.1rem; margin: 1rem 0 0.4rem; }
.web-cv .publications ol.bibliography li { margin-bottom: 0.8rem; }
.web-cv .publications .author > em { font-weight: 700; }
.cv-citation-links { overflow-wrap: anywhere; font-size: 0.9rem; }
.cv-citation .periodical p { margin-bottom: 0; }
.cv-download { font-size: 16px; white-space: nowrap; }
@media (max-width: 575px) { .cv-header { flex-direction: column; align-items: flex-start; gap: 1rem; } .cv-header > div { min-height: 0; gap: 0.75rem; } .cv-header img { order: -1; width: 120px; height: 150px; } }
</style>

<div class="post">
<header class="post-header cv-page-heading">
<h1 class="post-title">{{ page.title }}</h1>
<a class="cv-download" href="{{ '/assets/pdf/zeming-wu-cv.pdf' | relative_url }}" download>Download (PDF)</a>
</header>
<article>
<div class="web-cv">
<header class="cv-header">
<div>
<h2>{{ site.title }}</h2>
<p>PhD Candidate, Department of Mechanical Engineering<br>City University of Hong Kong, Hong Kong SAR, China</p>
<p><a href="mailto:zeming.wu@my.cityu.edu.hk">zeming.wu@my.cityu.edu.hk</a> · <a href="{{ '/' | relative_url }}">Website</a> · <a href="https://scholar.google.com/citations?user=sMCRzUIAAAAJ">Google Scholar</a><br>
<a href="https://github.com/ZamesNg">GitHub: ZamesNg</a> · <a href="https://www.linkedin.com/in/zeming-wu-439b661a9">LinkedIn</a> · <a href="https://orcid.org/0009-0004-8751-6938">ORCID: 0009-0004-8751-6938</a></p>
</div>
<img src="{{ '/assets/img/zeming-wu-cv.jpg' | relative_url }}" alt="Formal portrait of Zeming Wu" width="160" height="200">
</header>

<section aria-labelledby="cv-education">
<h2 id="cv-education">Education</h2>
<div class="cv-entry">
<div class="cv-entry-heading"><strong>City University of Hong Kong — Hong Kong SAR, China</strong><span class="cv-date">Sep 2024–Jun 2028 (Expected)</span></div>
<p>PhD in Mechanical Engineering; advisor: <a href="https://www.cityu.edu.hk/mne/people/academic-staff/mne-faculty/prof-liu-lu">Prof. Lu Liu</a></p>
</div>
<div class="cv-entry">
<div class="cv-entry-heading"><strong>Tongji University — Shanghai, China</strong><span class="cv-date">Sep 2021–Jun 2024</span></div>
<p>M.Sc. in Control Science and Engineering</p>
<p>Supervisor: <a href="https://ivcm.tongji.edu.cn/info/1100/1178.htm">Prof. Zhuping Wang</a>; research collaboration with <a href="https://ivcm.tongji.edu.cn/info/1100/1273.htm">Prof. Hao Zhang</a></p>
</div>
<div class="cv-entry">
<div class="cv-entry-heading"><strong>Tongji University — Shanghai, China</strong><span class="cv-date">Sep 2017–Jun 2021</span></div>
<p>B.Sc. in Automation</p>
</div>
</section>

<section aria-labelledby="cv-publications">
<h2 id="cv-publications">Publications</h2>
<p class="cv-ranking-note">Journal quartiles: JCR 2025 JIF, June 2026 release.<br>Robotics: T-RO — Q1; RA-L — Q2. Automation &amp; Control Systems: TII and TCYB — Q1.</p>
<div class="publications">
<h3>First-author publications</h3>
{% bibliography --query @*[keywords=first]* %}
<h3>Co-first-author publications</h3>
{% bibliography --query @*[keywords=cofirst]* %}
<h3>Other publications</h3>
{% bibliography --query @*[keywords=other]* %}
</div>
</section>

<section aria-labelledby="cv-interests">
<h2 id="cv-interests">Research Interests</h2>
<p>Distributed optimization, trajectory optimization, and motion planning for multi-agent systems; geometry-aware collision avoidance, robot coordination, and formation control.</p>
</section>

<section aria-labelledby="cv-skills">
<h2 id="cv-skills">Technical Skills</h2>
<p><strong>Programming and machine learning:</strong> Python, C/C++, MATLAB, PyTorch.<br>
<strong>Robotics software and simulators:</strong> MuJoCo, Isaac Gym, PyBullet, ROS, ROS 2, Gazebo.<br>
<strong>Manipulators:</strong> Franka FR3, AIRBOT Play.<br>
<strong>Mobile platforms:</strong> Genisom M1 quadruped; PX4-based quadrotors; Crazyflie platforms; ground vehicles.</p>
</section>

<section aria-labelledby="cv-languages">
<h2 id="cv-languages">Languages</h2>
<p>Mandarin (Native), Cantonese (Native), English.</p>
</section>

<section aria-labelledby="cv-reviewing">
<h2 id="cv-reviewing">Reviewing Service</h2>
<p><strong>Journals:</strong> T-RO, RA-L, T-AC, T-IE, T-II. <strong>Conferences:</strong> ICRA, IROS, CDC.</p>
</section>

</div>
</article>
</div>
