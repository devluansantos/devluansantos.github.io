---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date.Format "2006-01-02" }}
draft: true
description: "Descrição curta do post (2-3 linhas) para SEO e previews"
image: "/images/posts/{{ .Name }}.png"
---

