---

title: "Estudar Apanhando: Meu Laboratório Real no ThinkPad X230"
date: 2025-11-23
draft: true
description: "Como transformar um velho ThinkPad em um laboratório de segurança, forense e exploit dev — errando, quebrando e consertando tudo manualmente no caminho."
keywords:
  - "laboratório forense"
  - "thinkpad x230"
  - "fedora linux"
  - "exploit dev"
  - "reverse engineering"
  - "linux hardening"
image: "/images/posts/jornada-cyber.png"

---

## Estudar Apanhando

Todo mundo parece amar estudar com máquinas virtuais.
Eu não.

VMs são confortáveis demais. Elas escondem exatamente as partes que eu quero aprender: comportamento real do kernel, falhas de drivers, firmware mal-humorado, SSD reclamando, ACPI surtando. Tudo some quando você coloca uma camada de virtualização no meio.

Eu queria ver o sistema quebrando na minha frente.
Sem almofada.
Sem snapshot.
Sem fallback glorioso.

Então decidi montar um laboratório físico. Um de verdade.
Um ambiente para abrir, desmontar, particionar, ferrar e reconstruir quantas vezes fosse necessário.

E é aqui que entra o herói relutante da história: o ThinkPad X230.

![ThinkPad X230 aberto sobre a mesa](/images/posts/x230-desk.jpg)

---

## O X230 Que Eu Insisti Em Torturar

Você já viu um X230. Ele parece só um notebook velho, mas é praticamente imortal.
Peças baratas, modular, tudo parafusado — e o mais importante — fácil de quebrar sem peso na consciência.

Eu instalei Fedora Linux não porque é “o mais técnico”, nem porque é “o mais amigo do usuário”.
Fedora ocupa o meio-termo perfeito para um laboratório: moderno o suficiente para te desafiar, e honesto o suficiente para te deixar quebrar o sistema sem tentar te salvar.

Arch Linux te dá controle absoluto.
OpenBSD te dá uma fortaleza.
Gentoo te dá um doutorado em paciência.

Fedora te dá a verdade.

![Fedora Linux desktop](/images/posts/fedora.png)

---

## Primeira Grande Pancada: LUKS2 Indo Longe Demais

Comecei configurando criptografia LUKS2 com Argon2id como se estivesse preparando uma infraestrutura militar.
O Fedora respondeu com um boot de **quatro minutos**.

Quatro.

Minutos.

Achei que o SSD tinha morrido.
Achei que tinha configurado o initramfs errado.
Achei tudo — menos a verdade: eu mesmo tinha sabotado o sistema.

### LUKS2: erro e diagnóstico

```bash
cryptsetup luksFormat /dev/sda2 --type luks2 --pbkdf argon2id --iter-time 2000 --key-size 64
```

Sintoma:

```text
A start job is running for Remount Root and Kernel File Systems (3min 40s)
```

Diagnóstico:
Argon2id consumia tanta memória no initramfs que o boot praticamente travava.

### Correção

```bash
cryptsetup benchmark
cryptsetup luksFormat /dev/sda2 --type luks2 --pbkdf argon2id --iters 4 --mem 65536
```

Boot voltou ao normal.
Lição: segurança sem contexto vira autoflagelação.

![initramfs boot slow](/images/posts/boot-slow.png)

---

## Segunda Pancada: Quando Quebrei Meu Próprio Sistema

Decidi montar `/tmp` com `noexec`.
Parecia uma boa ideia — por 10 segundos.

Aí quebrei:

* compiladores
* instaladores
* scripts temporários
* metade do sistema

### Erro real: `/tmp` noexec

```text
/tmp/ccW3x4wq: cannot execute binary file
configure: error: cannot run C compiled programs.
```

auditd confirmou a burrada:

```text
avc:  denied  { execute } for comm="configure" name="ccW3x4wq"
```

### Correção sensata

```bash
mkdir -p /var/tmp/build
mount -o remount,exec /var/tmp/build
cd /var/tmp/build && ./configure && make
```

Hardening não é seguir receita.
É entender o bisturi antes de cortar.

![SELinux log](/images/posts/selinux-log.png)

---

## Quando Percebi que Precisava de Ferramentas de Gente Grande

Depois de reconstruir o sistema tantas vezes que perdi a conta, ficou claro que eu precisava de ferramentas guiadas por necessidade real.

Na rede:
`tcpdump` mostrou o caos bruto.
Wireshark traduziu o caos.
Bettercap mostrou como interferir no caos.

Forense:
`sleuthkit`, `autopsy`, `volatility`, `rekall`.

OSINT:
theHarvester, recon-ng, Maltego.

Auditoria:
auditd — a ferramenta que te mostra a verdade que você preferia não ver.

![Wireshark screenshot](/images/posts/wireshark.png)

---

## A Memória: Onde a Mentira Evapora

Heap, stack, mmap, relocations.
Se você quer explorar binários, tem que parar de chutar e começar a olhar dumps de memória.

Volatility e Rekall viraram rotina.

![Volatility UI](/images/posts/volatility.png)

---

## Reverse Engineering: Onde o Binário Conta a Verdade

Eu queria entender o que o binário pensa.
Não o que o código-fonte promete.

Ghidra virou meu RE principal.
radare2 quando quero sofrer.
Binary Ninja quando quero conforto.

### Quando o Ghidra explodiu

```text
java.lang.OutOfMemoryError: Java heap space
```

Correção:

```bash
export GHIDRA_JAVA_OPTIONS="-Xmx4G -Xms1G -XX:+UseG1GC"
./ghidraRun
```

![Ghidra screenshot](/images/posts/ghidra.png)

---

## Debuggers: Acendendo a Luz no Quarto Escuro

gdb + pwndbg/gef é meu ritual.
lldb quando o binário veio do clang.
strace/ltrace para ver a verdade acontecendo.
rr para voltar no tempo.

### Exemplo real

```text
SIGSEGV at 0x7fffdeadbeef
```

gdb:

```gdb
0x5555555546f2 in process_chunk() at vuln.c:128
*((uint64_t*)ptr) = value; // write past boundary
```

![pwndbg screenshot](/images/posts/pwndbg.png)

---

## Exploit Development: O Ponto Sem Retorno

pwntools, ROPgadget, one_gadget, checksec, pwninit.
O kit básico de quem decide que “vulnerabilidade” é só outra palavra para “possibilidade”.

---

## Fuzzing: Quando o Caos Encontra o Acaso

AFL++, Hongfuzz e libFuzzer encontraram erros que eu jamais encontraria manualmente.

### Quando AFL++ travou

```text
paths_total: 1
[!] The queue cycle took a long time but produced nothing new.
```

Correção:

```bash
CFLAGS="-O2 -fno-omit-frame-pointer -g" afl-clang-fast -o target target.c
```

![AFL run](/images/posts/afl-run.png)

---

## Heap: Onde Morre a Sanidade Humana

Eu achava que entendia heap.
Não entendia nada.

Heaptrack, libheap, ptmalloc scripts.

### Valgrind mostrando a verdade

```text
Invalid write of size 8
Address ... is after a block of size 16
```

---

## Outras Arquiteturas: ARM, MIPS, RISC-V

Rodar coisas sob qemu muda completamente sua expectativa do que um binário deveria fazer. Cada arquitetura traz sua dose de caos e elegância.

ARM tem seus humores.
MIPS adora te punir por assumir demais.
RISC-V é quase terapêutico depois de uma semana mexendo com ptmalloc.

Compilar, portar e rodar nesses ambientes me mostrou como pequenos detalhes mudam tudo: alinhamento, registradores, convenções de chamada, offsets, tamanhos.

```bash
qemu-arm -L /usr/arm-linux-gnueabihf ./program
qemu-mips -L /usr/mips-linux-gnu ./program
```

É outro mundo — e dominar isso abre muitas portas.

---

## Toolchains e Sanitizers: Quando o ASan Decide Te Odiar

Sanitizers são incríveis… quando funcionam. Quando não funcionam, você perde a fé temporariamente na computação.

### Erro real: ASan

```text
ASan runtime does not come first
Aborted (core dumped)
```

Geralmente isso acontece por incompatibilidade entre runtime, glibc e binário.

### Correção temporária (para debugging)

```bash
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

E recompilar tudo com consistência:

```bash
clang -fsanitize=address -g -O1 program.c -o program
```

Nunca confie cegamente nos sanitizers. Eles são úteis, mas temperamentais.

---

## Vim Cru — Sem Plugins, Sem Ajuda

Usei Vim puro. Nenhum plugin. Nenhuma configuração que escondesse minha incompetência.

Por quê?

Porque se eu consigo trabalhar assim, eu consigo trabalhar em qualquer servidor quebrado do mundo.
Sem LSP. Sem autocomplete. Sem conforto.

É brutal, mas ensina disciplina.

```text
:set number
:set tabstop=4
:q!
```

Se você sabe usar Vim cru, você abre qualquer arquivo em qualquer ambiente — mesmo quando tudo está pegando fogo.

---

## Conclusão

Esse laboratório não nasceu pronto. Ele nasceu do caos — e da minha insistência em aprender quebrando tudo primeiro.

O Fedora não me abraçou. Ele me mostrou os erros de frente.
O X230 aguentou pancada atrás de pancada.
E eu aprendi mais destruindo e reconstruindo sistemas do que em qualquer tutorial polido.

Se você realmente quer aprender segurança, baixo nível, RE, exploit dev… crie um ambiente onde o erro dói.

Porque ele ensina.

**A melhor forma de aprender é errando.
A segunda melhor é errar de novo — mas com mais estilo.**
