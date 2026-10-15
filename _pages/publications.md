---
layout: page
permalink: /publications/
title: Publications
description: Distributed optimization, robot motion planning, and multi-agent systems.
nav: true
nav_order: 2
---

<link rel="stylesheet" href="{{ '/assets/css/personal.css' | relative_url }}">

<style>
.post-description { margin-bottom: 1rem; }
.publications { margin-top: 0.75rem; }
.publications h2 { margin-bottom: 0.5rem; }
</style>

[Download the complete bibliography (BibTeX)]({{ '/assets/bibliography/publications.bib' | relative_url }}).

{% include bib_search.liquid %}

<div class="publications">
<h2>First-author publications</h2>
{% capture first_papers %}{% bibliography --query @*[keywords=first]* %}{% endcapture %}
{{ first_papers | replace: 'class="bibtex btn', 'tabindex="0" href="#" aria-label="Show BibTeX citation" class="bibtex btn' | replace: '>Bib</a>', '>BibTeX</a>' }}
<h2>Co-first-author publications</h2>
{% capture cofirst_papers %}{% bibliography --query @*[keywords=cofirst]* %}{% endcapture %}
{{ cofirst_papers | regex_replace: 'Yunkai\s+Lv', 'Yunkai Lv<sup>†</sup>' | regex_replace: 'Zeming\s+Wu</em>', 'Zeming Wu<sup>†</sup></em>' | replace: 'class="bibtex btn', 'tabindex="0" href="#" aria-label="Show BibTeX citation" class="bibtex btn' | replace: '>Bib</a>', '>BibTeX</a>' }}
<h2>Other publications</h2>
{% capture other_papers %}{% bibliography --query @*[keywords=other]* %}{% endcapture %}
{{ other_papers | replace: 'class="bibtex btn', 'tabindex="0" href="#" aria-label="Show BibTeX citation" class="bibtex btn' | replace: '>Bib</a>', '>BibTeX</a>' }}
</div>
