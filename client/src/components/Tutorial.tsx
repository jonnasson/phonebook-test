import { useEffect } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "../styles/driver-theme.css";

const SESSION_KEY = "tutorial_dismissed_session";

function shouldRunTutorial(): boolean {
  return !sessionStorage.getItem(SESSION_KEY);
}

export default function Tutorial() {
  useEffect(() => {
    if (!shouldRunTutorial()) return;

    const steps: DriveStep[] = [
      {
        element: () =>
          document.querySelector("#search-bar")?.closest(".MuiFormControl-root") as Element,
        popover: {
          title: "Suchleiste",
          description:
            "Alle Kontakte werden angezeigt. Tippen Sie einen Namen, um die Liste zu filtern. Tipp: Dr\u00FCcken Sie \u201E/\u201C um die Suche direkt zu fokussieren.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#add-entry-fab",
        popover: {
          title: "Neuer Eintrag",
          description:
            "\u00DCber diesen Button k\u00F6nnen Sie neue Kontakte zum Telefonbuch hinzuf\u00FCgen.",
          side: "top",
          align: "end",
        },
      },
    ];

    const instance = driver({
      popoverClass: "telefonbuch-popover",
      overlayColor: "rgb(15, 23, 42)",
      overlayOpacity: 0.55,
      stagePadding: 6,
      stageRadius: 4,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Weiter",
      prevBtnText: "Zur\u00FCck",
      doneBtnText: "Fertig",
      progressText: "{{current}} von {{total}}",
      showProgress: true,
      animate: false,
      allowClose: false,
      onCloseClick: () => {
        instance.destroy();
      },
      onDestroyed: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
      },
      steps,
    });

    instance.drive();

    return () => {
      instance.destroy();
    };
  }, []);

  return null;
}
