import {
  createVideoElement,
  getMediaStream,
  stopVideoElement,
} from "../../controllers/camera";
import { createCanvasElement, drawCanvas } from "../../controllers/canvas";
import { Resolution } from "@interfaces/ascii-table";

export class GbComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = /* html */ `
        <style>
          @import url("./node_modules/nes.css/css/nes.css");
          canvas{
            width: 100%;
          }

          .nes-container{
            min-width: 467px;
            background-color: #fff;
          }

          .cameraContainer{
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 20px;
            width: 100%;

            & .canvas-wrapper{
              width: 80%;
              border: 5px solid #fff;
            }
          }

          footer{
            display: flex;
            flex-direction: flex-end;
            gap: 16px;

              & ness-container{
                width: 58%;
              }

            & button{
              width: 100px;
              height: 40px;
            }

            & fieldset.buttons-container{
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 24px;
            }

            & .nes-balloon{
              position: absolute;
              width: max-content;
              transform: translate( -7px, -87px);
            }
          }
        </style>
      <div class="tui-screen bordered blue-168" style="padding: 40px">
        <div class="nes-container with-title">
          <p class="title">Ga WebCam</p>
          <div class="cameraContainer">
          <div class="canvas-wrapper">
            <canvas></canvas>
            </div>
          </div>
          <footer>
          <div class="nes-container is-rounded is-dark">
            <p>
              WebCam modo GB estilo GameBoy
            </p>
          </div>
          <fieldset class="buttons-container">
            <button type="button" class="nes-btn is-success">Abrir</button>
            <button id="quit" type="button" class="nes-btn is-error">Cerrar</button>
          </fieldset>
          <fieldset>
            <i class="nes-octocat animate"></i>
            <div class="nes-balloon from-left is-dark">
              <p>Visita el Proyecto<br/> en Github</p>
            </div>
          </fieldset>
          </footer>
        </div>
      </div>
    `;

    this.shadowRoot
      ?.querySelector(".scandisk-button")
      ?.addEventListener("click", this.handleContinueClick.bind(this));

    const resolution: Resolution = { width: 84, height: 55 };

    const getUserCam = async () => {
      const userMedia = await getMediaStream();

      if (!userMedia) {
        this.shadowRoot
          ?.querySelector("alert-modal")
          ?.setAttribute("show", "true");
        return;
      }

      const videoElement = createVideoElement(userMedia);
      document.body.appendChild(videoElement);
      const canvasElement = this.shadowRoot?.querySelector(
        "canvas"
      ) as HTMLCanvasElement;

      createCanvasElement(resolution, videoElement, canvasElement);

      const tableElement = this.shadowRoot?.querySelector(
        "table"
      ) as HTMLTableElement;
      drawCanvas(canvasElement, tableElement);
    };

    getUserCam();

    this.shadowRoot
      ?.querySelector("#quit")
      ?.addEventListener("click", this.handleContinueClick.bind(this));

    this.shadowRoot?.querySelector("#open")?.addEventListener("click", () => {
      getUserCam();
    });
  }

  handleContinueClick() {
    const webcamSelect = this.shadowRoot?.getElementById(
      "webcam"
    ) as HTMLSelectElement;
    const selectedWebcam = webcamSelect?.value;

    const event = new CustomEvent("changePage", {
      detail: { selectedWebcam },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  disconnectedCallback() {
    const videoElement = document.querySelector("video");
    if (videoElement && videoElement.srcObject) {
      stopVideoElement(videoElement);
    }
  }
}

customElements.define("app-gb-component", GbComponent);
