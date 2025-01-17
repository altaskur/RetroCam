export class HomeComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = /* html */ `
      <style>
        @import url('/src/assets/tuiCss/tuicss.css');
        div.tui-screen {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          height: 100vh;
        }

        main {
          height: 100%;
        }

        fieldset {
          border: 0;
          margin: 0;
        }

        article {
          padding: 8px;
          padding-top: 16px;
        }

        .animate-cursor{
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
    </style>

    <div class="tui-screen bordered blue-168" style="padding: 40px">

    <header>
      <h1 class="cyan-255-text">AltasSO v1.0</h1>
      <hr class="tui-divider cyan-255-border"></span>
    </header>

    <main>
      <p class="white-168-text">
        Selecciona la webcam que deseas utilizar:
      </p>

      <fieldset class="white-168-text">
        <label for="webcam">Webcam:</label>
        <select class="tui-input" id="webcam" name="webcam">
          <option value="ascii">ASCII WEBCAM</option>
          <option value="gb">GA Webcam</option>
        </select>
      </fieldset>

        <div class="tui-window orange-168 black-255-text">
            <fieldset class="tui-fieldset tui-border-solid white-border">
                <article>
                  Abre la webcam en modo ASCII dónde <br />
                  mostrará la imagen de tu webcam en <br />
                  formato de texto. <span class="cyan-255-text animate-cursor">█</span>
                </article>
                <br/>
                <div class="tui-fieldset-text">Text format: UTF-8</div>
                <div class="tui-fieldset-text right">Ln: 3, Col: 17</div>
            </fieldset>
        </div>
    </main>
      <footer>
        <fieldset>
          <button class="tui-button scandisk-button"><span class="white-text">C</span>ontinuar</button>

      </fieldset>
        <hr class="tui-divider cyan-255-border"/>
          <span class="cyan-255-text">
            AltasSO v1.0 <span class="white-168-text"> Made with <span class="red-255-text">❤</span> by Altaskur
          </span>
      </footer>
  </main>
</div>
  `;

    this.shadowRoot
      ?.querySelector(".scandisk-button")
      ?.addEventListener("click", this.handleContinueClick.bind(this));

    this.shadowRoot
      ?.querySelector("select")
      ?.addEventListener("change", this.handleWebcamChange.bind(this));
  }

  handleWebcamChange(event: Event) {
    const articleElement = this.shadowRoot?.querySelector("article");
    const select = event.target as HTMLSelectElement;
    const selectedWebcam = select.value;

    const gaText = `Abre la webcam en modo 'GA' <br/>
    con una resolución y color similar <br/>
    a la mítica Game Boy.<span class="cyan-255-text animate-cursor">█</span>`;

    const asciiText = `Abre la webcam en modo ASCII dónde <br />
       mostrará la imagen de tu webcam en <br />
       formato de texto.<span class="cyan-255-text animate-cursor">█</span>`;

    if (!articleElement) return;

    switch (selectedWebcam) {
      case "ascii":
        articleElement.innerHTML = asciiText;
        break;
      case "gb":
        articleElement.innerHTML = gaText;
        break;
      default:
        break;
    }
  }

  handleContinueClick() {
    // Obtén el valor seleccionado de la webcam
    const webcamSelect = this.shadowRoot?.getElementById(
      "webcam"
    ) as HTMLSelectElement;
    const selectedWebcam = webcamSelect?.value;

    // Crea y despacha un evento personalizado
    const event = new CustomEvent("changePage", {
      detail: { selectedWebcam }, // Incluye datos adicionales si es necesario
      bubbles: true, // Permite que el evento se propague fuera del shadow DOM
      composed: true, // Permite que el evento atraviese el shadow DOM
    });
    this.dispatchEvent(event);
  }
}

customElements.define("app-home-component", HomeComponent);
