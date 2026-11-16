<script lang="ts">
  // The figures that are mostly words: the OWASP grid, the phishing examples, the pillars, the questions.
  import { reveal } from '$lib/actions/reveal.js';
  type Kind = 'top10' | 'phish' | 'pillars' | 'questions';
  let { kind }: { kind: Kind } = $props();

  const groups = [
    ['What goes in', [['01', 'Prompt Injection'], ['04', 'Supply Chain'], ['05', 'Data and Model Poisoning'], ['09', 'Vector and Embedding Weaknesses']]],
    ['What comes out', [['02', 'Sensitive Information Disclosure'], ['07', 'Misinformation'], ['08', 'Hidden Context Exposure'], ['10', 'Improper Output Handling']]],
    ['What it can do', [['03', 'Excessive Agency'], ['06', 'Unbounded Consumption']]],
  ] as const;
  const order = (n: string) => Number(n) * 0.09;
  const msgs = [
    ['Email · Accounts team', 'Hi Priya, as discussed Monday, please approve the new bank details for Harbor Supply before 3 pm.', 'Urgent + new bank details'],
    ['Call · “Your CEO”', '', 'Cloned voice'],
    ['Chat · IT support', 'Can you read me the sign-in code I just sent?', 'Asks for a code'],
  ];
  const pillars = [['Fairness', 'Check for bias'], ['Transparency', 'Say how it works'], ['Privacy', 'Protect personal data'], ['Accountability', 'Clear ownership'], ['Human oversight', 'People make the big calls']];
  const questions = ['How do you skim it without getting overwhelmed?', 'Do you focus on the intent and the expected outcome?', 'How do you know it is relevant, accurate and aligned with what you need?'];
</script>

<div class="hf" use:reveal>
  {#if kind === 'top10'}
    <div class="t10">
      {#each groups as [title, items]}
        <div class="col">
          <p class="grp r">{title}</p>
          {#each items as [n, name]}
            <div class="t r" style="--d:{order(n)}s" class:first={n === '01'}><b>{n}</b><span>{name}</span></div>
          {/each}
        </div>
      {/each}
    </div>
  {:else if kind === 'phish'}
    <div class="msgs">
      {#each msgs as [head, body, flag], i}
        <div class="msg r" style="--d:{i * 0.35}s;margin-left:{i * 18}px">
          <p class="mh">{head}</p>
          {#if body}<p class="mb">{body}</p>{:else}<div class="wave" aria-hidden="true">{#each Array(28) as _, k}<i style="height:{6 + Math.abs(Math.sin(k * 1.7)) * 22}px"></i>{/each}</div>{/if}
          <span class="flag r" style="--d:{1.4 + i * 0.3}s">{flag}</span>
        </div>
      {/each}
      <p class="note">Names and messages are fictional examples.</p>
    </div>
  {:else if kind === 'pillars'}
    <div class="pil">
      <div class="row">
        {#each pillars as [t, d], i}
          <div class="p r" style="--d:{0.4 + i * 0.15}s"><b>{t}</b><span>{d}</span></div>
        {/each}
      </div>
      <div class="base r" style="--d:0s"><b>Governance underneath</b><span>AI use policy · model inventory · risk reviews · NIST AI RMF · ISO/IEC 42001</span></div>
    </div>
  {:else if kind === 'questions'}
    <ol class="qs">
      {#each questions as q, i}<li class="r" style="--d:{i * 0.5}s"><b>{i + 1}</b><span>{q}</span></li>{/each}
    </ol>
  {/if}
</div>

<style>
  .hf { padding: 22px; font-family: var(--font-ui); color: var(--ink); }
  :global([data-anim]) .r { opacity: 0; transform: translateY(10px); }
  :global([data-anim][data-on]) .r { opacity: 1; transform: none; transition: opacity 0.45s ease var(--d, 0s), transform 0.55s cubic-bezier(0.2, 0.6, 0.2, 1) var(--d, 0s); }

  .t10 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .col { display: flex; flex-direction: column; gap: 8px; }
  .grp { margin: 0 0 2px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
  .t { display: grid; grid-template-columns: 26px 1fr; gap: 8px; align-items: baseline; padding: 9px 10px; background: var(--paper); border: 1px solid var(--paper-edge); border-radius: 8px; font-size: 12.5px; line-height: 1.3; }
  .t b { font-family: var(--font-display); font-weight: 400; font-size: 17px; color: var(--accent); }
  .t.first { border-color: var(--accent); }

  .msgs { display: flex; flex-direction: column; gap: 12px; }
  .msg { position: relative; max-width: 86%; padding: 12px 14px; background: var(--paper); border: 1px solid var(--paper-edge); border-radius: 10px; }
  .mh { margin: 0 0 4px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); }
  .mb { margin: 0; font-size: 13.5px; line-height: 1.45; }
  .wave { display: flex; align-items: center; gap: 3px; height: 30px; }
  .wave i { display: block; width: 4px; border-radius: 2px; background: var(--ink-mute); }
  .flag { position: absolute; right: -10px; top: -10px; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; background: var(--accent); color: var(--paper); }
  .note { margin: 2px 0 0; font-size: 11px; color: var(--ink-soft); }

  .pil { display: flex; flex-direction: column; gap: 8px; }
  .row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; align-items: end; }
  .p { display: flex; flex-direction: column; gap: 4px; min-height: 120px; justify-content: flex-end; padding: 12px 10px; background: var(--paper); border: 1px solid var(--paper-edge); border-radius: 10px 10px 4px 4px; }
  .p b { font-family: var(--font-display); font-weight: 400; font-size: 15px; line-height: 1.15; }
  .p span { font-size: 11.5px; line-height: 1.35; color: var(--ink-mute); }
  .base { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 8px; background: var(--ink-mute); color: var(--paper); }
  .base b { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; opacity: 0.8; }
  .base span { font-size: 13px; line-height: 1.4; }

  .qs { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .qs li { display: grid; grid-template-columns: 30px 1fr; gap: 12px; align-items: center; padding: 14px 16px; background: var(--paper); border: 1px solid var(--paper-edge); border-radius: 10px; font-size: 15px; line-height: 1.4; }
  .qs b { font-family: var(--font-display); font-weight: 400; font-size: 28px; color: var(--accent); text-align: center; }

  @media (max-width: 560px) {
    .t10 { grid-template-columns: 1fr; }
    .row { grid-template-columns: repeat(2, 1fr); }
    .msg { max-width: 100%; margin-left: 0 !important; }
  }
</style>
