import { AsciiComponent, GbComponent, HomeComponent } from "./components/index";

const enum Views {
  HOME = "home",
  GB = "gb",
  ASCII = "ascii",
}

const homeComponent = new HomeComponent();
const gbComponent = new GbComponent();
const asciiComponent = new AsciiComponent();

document.querySelector("div.container")?.appendChild(homeComponent);

const getSelectedView = (view: Views) => {
  switch (view) {
    case Views.HOME:
      return homeComponent;
    case Views.GB:
      return gbComponent;
    case Views.ASCII:
      return asciiComponent;
    default:
      return homeComponent;
  }
};

const changeView = (actualView: Views, newView: Event) => {
  const newViewStr = newView as unknown as string;
  const newViewElement = getSelectedView(newViewStr as Views);
  if (actualView && newViewElement) {
    document
      .querySelector("div.container")
      ?.removeChild(getSelectedView(actualView));
    document.querySelector("div.container")?.appendChild(newViewElement);
  }
};

homeComponent?.addEventListener("changePage", (event) => {
  const customEvent = event as CustomEvent;
  const selected = customEvent.detail.selectedWebcam;
  changeView(Views.HOME, selected);
});

asciiComponent?.addEventListener("changePage", (event) => {
  const customEvent = event as CustomEvent;
  const selected = customEvent.detail.selectedWebcam;
  changeView(Views.ASCII, selected);
});

gbComponent?.addEventListener("changePage", (event) => {
  const customEvent = event as CustomEvent;
  const selected = customEvent.detail.selectedWebcam;
  changeView(Views.GB, selected);
});
