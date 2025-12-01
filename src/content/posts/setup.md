---
title: "Estudar Apanhando: Meu Laboratório Real no ThinkPad X230"
slug: "thinkpad-x230-lab-forense-linux"
date: 2025-11-23
draft: true
summary: "Abandonei as VMs para sofrer no hardware real. Como transformar um velho ThinkPad em um laboratório de segurança, forense e exploit dev — errando, quebrando e consertando tudo manualmente."
categories:
  - "Hardening"
  - "Linux"
  - "Security"
tags:
  - "fedora"
  - "x230"
  - "reverse-engineering"
  - "exploit-dev"
  - "homelab"
image: "/images/posts/jornada-cyber.png"
---

## Estudar Apanhando

Todo mundo parece amar estudar com máquinas virtuais. Eu não.

VMs são confortáveis demais. Elas agem como um "isolamento acústico", escondendo exatamente as partes ruidosas que eu preciso ouvir: o comportamento real do kernel, falhas de drivers obscuros, firmware mal-humorado, SSD reclamando, ACPI surtando. Tudo isso desaparece quando você coloca uma camada de abstração no meio.

Eu queria ver o sistema quebrando na minha frente. Sem almofada. Sem botão de snapshot. Sem aquele *fallback* glorioso que te salva de ter que ler a documentação.

Decidi montar um laboratório físico. Um ambiente para abrir, desmontar, particionar, ferrar completamente e reconstruir.

É aqui que entra o herói relutante da história: o **ThinkPad X230**.

![ThinkPad X230 aberto sobre a mesa, mostrando o teclado clássico e tela com terminal](/images/posts/x230-desk.jpg)

---

## O X230 Que Eu Insisti Em Torturar

Você já viu um X230. Ele parece só um notebook corporativo velho, mas é praticamente imortal. Peças baratas, modularidade real (lembra quando notebooks tinham parafusos?), e o mais importante: zero peso na consciência se eu fritar alguma coisa.

Escolhi o **Fedora Linux** não pelo hype, mas pelo pragmatismo agressivo.
O Arch te dá controle absoluto (e ansiedade). O OpenBSD te dá uma fortaleza inexpugnável. O Gentoo te dá um doutorado em compilação e paciência.

O Fedora ocupa o meio-termo perfeito para um laboratório de segurança: moderno o suficiente para ter as features novas do kernel que eu quero explorar, mas honesto o suficiente para me deixar quebrar o sistema sem tentar me segurar pela mão.

Ele te entrega a verdade.

![Screenshot do desktop Fedora Linux limpo com terminal aberto](/images/posts/fedora.png)

---

## O Boot de 4 Minutos (Ou: A Paranoia do LUKS2)

Comecei configurando criptografia LUKS2 com Argon2id como se estivesse protegendo segredos de estado ou a fórmula da Coca-Cola. O resultado? O Fedora respondeu com um boot de **quatro minutos**.

Quatro. Minutos. Cronometrados.

Achei que o SSD tinha morrido. Achei que tinha errado o `UUID` no fstab. A verdade era mais simples: eu fui ganancioso na segurança sem entender o custo computacional.

**O comando do crime:**

```bash
# O exagero:
cryptsetup luksFormat /dev/sda2 --type luks2 --pbkdf argon2id --iter-time 2000 --key-size 64