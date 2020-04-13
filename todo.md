minrt

```
import { router } from "minrt";
import { stateManager } from "minst";

router.navigate("/subscriptions");

router.mapPath("/subscriptions/{subscriptionId}", router => {
    router.params.subscriptionId;
});

router.mapPath("/repositories", "<repositories-list><repositories-list>");

router.initialize({
    root: document.querySelector("#root"),
    getState: () => stateManager.getStates(),
    setState: (state) => stateManager.replace(state),
    notFound: "<not-found></not-found>"
});

```