import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';

@Component({
  selector: 'app-contact',
  imports: [PageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <article class="page">
        <h1 class="title">contact</h1>

        <p class="text">
          The fastest way to reach me is via social links. 
          <br> 
          If you want to collaborate, include a short summary + timeline.
        </p>

        <table class="table" aria-label="Contact links">
          <tbody>
            <tr class="row">
              <th class="label" scope="row">Facebook</th>
              <td class="value">
                <a class="link" href="https://www.facebook.com/phucscl" target="_blank" rel="noopener">facebook.com/phucscl</a>
              </td>
            </tr>
            <tr class="row">
              <th class="label" scope="row">Email</th>
              <td class="value">
                <a class="link" href="mailto:phuc.foreveralone@gmail.com">phuc.foreveralone@gmail.com</a>
              </td>
            </tr>
            <tr class="row">
              <th class="label" scope="row">GitHub</th>
              <td class="value">
                <a class="link" href="https://github.com/phuc4real" target="_blank" rel="noopener">github.com/phuc4real</a>
              </td>
            </tr>
            <tr class="row">
              <th class="label" scope="row">MyAnimeList</th>
              <td class="value">
                <a class="link" href="https://myanimelist.net/profile/phucscl" target="_blank" rel="noopener">myanimelist.net/profile/phucscl</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text dim">Last updated: 2026-01-02</p>
      </article>
    </app-page-shell>
  `,
  styles: `
    .page { 
        max-width: 520px; 
    }
    .title {
      font-size: clamp(1.75rem, 4vw + 1rem, 2.125rem); /* Fluid 28px-34px */
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 18px;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }
    .text {
      font-size: 14px;
      line-height: 1.9;
      color: var(--accent-cyan);
      margin: 0 0 14px;
    }
    .text.dim { color: var(--text-cyan-dim); }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0 0;
      color: var(--accent-cyan);
      border: 1px solid var(--purple-muted);
    }

    .row { border: 0; }

    .label {
      font-size: 11px;
      letter-spacing: 0.6px;
      color: var(--accent-cyan);
      text-transform: uppercase;
      text-align: left;
      padding: 12px;
      vertical-align: middle;
      width: 90px;
      border: 1px solid var(--purple-muted);
    }
    .value {
      margin: 0;
      padding: 12px;
      vertical-align: middle;
      border: 1px solid var(--purple-muted);
    }

    .link {
      color: var(--accent-cyan);
      text-decoration: underline;
      text-underline-offset: 5px;
      display: inline-block;
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }
    .link:hover,
    .link:focus-visible {
      background: var(--neon-magenta); 
      color: var(--bg-black);
      box-shadow: 0 0 12px var(--glow-magenta);
    }

    @media (max-width: 640px) {
      .row {
        display: block;
        border: 1px solid var(--purple-muted);
        margin-bottom: 12px;
      }

      .label,
      .value {
        display: block;
        width: auto;
        border: 0;
        padding: 10px 12px;
      }

      .label {
        border-bottom: 1px solid var(--purple-muted);
      }
    }
  `
})
export class ContactComponent {}
