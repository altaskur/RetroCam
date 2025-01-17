import {
  createVideoElement,
  getMediaStream,
  stopVideoElement,
} from "../../controllers/camera";
import { createCanvasElement, drawCanvas } from "../../controllers/canvas";
import { Resolution } from "@interfaces/ascii-table";
import { generateTable } from "../../controllers/ascii-table";

export class AsciiComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = /* html */ `
        <style>
          @import url('assets/tuiCss/tuicss.css');

          canvas{
            display: none;
          }

          table{
            font-size: 0.5em;
          }

          .tui-nav,
          .tui-sidenav,
          .tui-statusbar {
              position: static !important;
          }

          .tui-screen {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;

            & .tui-window {
              height: 100%;

              & fieldset{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;

                & .cameraContainer{
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  & table{
                    border: 8px double #FFF;
                  }
                }
              }
            }
          }
      </style>

      <div class="tui-screen bordered tui-bg-blue-black">

      <nav class="tui-nav ">
        <span class="tui-datetime" data-format="h:m:s a"></span>
        <ul>
          <li class="tui-sidenav-button red-168-text">≡</li>
          <li class="tui-dropdown">
            <span class="red-168-text">F</span>ile
            <div class="tui-dropdown-content">
                <ul>
                    <li>
                        <a href="#!">
                            <span class="red-168-text">N</span>ew
                        </a>
                    </li>
                    <li>
                        <a href="#!" id="open">
                            <span class="red-168-text">O</span>pen...
                            <span class="tui-shortcut">F3</span>
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            <span class="red-168-text">S</span>ave
                            <span class="tui-shortcut">F2</span>
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            S<span class="red-168-text">a</span>ve as...
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            Save a<span class="red-168-text">l</span>l
                        </a>
                    </li>
                    <div class="tui-black-divider"></div>
                    <div class="tui-black-divider"></div>
                    <li>
                        <a href="#!" id="quit">
                            <span class="red-168-text">Q</span>uit
                            <span class="tui-shortcut">F10</span>
                        </a>
                    </li>
                </ul>
            </div>
        </li>
        <li class="tui-dropdown">
            <span class="red-168-text">E</span>dit
        </li>
        <li class="tui-dropdown">
            <span class="red-168-text">V</span>iew
        </li>
        <li class="tui-dropdown">
            <span class="red-168-text">H</span>elp
        </li>
      </ul>
    </nav>

    <div class="tui-window full-width tui-no-shadow">
      <fieldset class="tui-fieldset">
        <legend class="center">MyCamm.CPP</legend>
        <div class="cameraContainer"></div>
        <canvas></canvas>
      </fieldset>
    </div>

    <div class="tui-statusbar ">
      <ul>
          <li><a href="#!"><span class="red-168-text">F1</span> Help</a></li>
          <li><a href="#!"><span class="red-168-text">F2</span> Save</a></li>
          <li><a href="#!"><span class="red-168-text">F3</span> Open</a></li>
          <li><a href="#!"><span class="red-168-text">Alt+F9</span> Compile</a></li>
          <span class="tui-statusbar-divider"></span>
          <li><a href="#!"><span class="red-168-text">F10</span> Menu</a></li>
      </ul>
    </div>

  </div>
`;

    const resolution: Resolution = { width: 84, height: 45 };
    this.shadowRoot
      ?.querySelector("#quit")
      ?.addEventListener("click", this.handleContinueClick.bind(this));

    this.shadowRoot?.querySelector("#open")?.addEventListener("click", () => {
      getUserCam();
    });

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

      this.shadowRoot
        ?.querySelector(".cameraContainer")
        ?.appendChild(generateTable(resolution));

      const tableElement = this.shadowRoot?.querySelector(
        "table"
      ) as HTMLTableElement;

      createCanvasElement(resolution, videoElement, canvasElement);
      drawCanvas(canvasElement, tableElement);
    };

    getUserCam();
  }

  handleContinueClick() {
    const selectedWebcam = "home";
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

customElements.define("app-ascii-component", AsciiComponent);
