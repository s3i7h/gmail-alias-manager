import {
  Module,
  VuexModule,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from ".";
import { RootState } from "@/store/types";
import { dispatch } from "@/util/functools";
import { deepAssign } from "@/util/deep";

const defaultRootState: () => RootState = () => ({
  address: "",
  aliasBlueprint: "{timestamp}",
  aliases: [],
  counts: {},
  aliasPropComponents: {}
});

@Module({
  dynamic: true,
  store,
  name: "RootModule",
  namespaced: true
})
class RootModule extends VuexModule implements RootState {
  address = "";
  @Mutation
  setAddress(newAddress: string) {
    this.address = newAddress;
  }

  aliasBlueprint = "";
  @Mutation
  setAliasBlueprint(newAliasBlueprint: string) {
    this.aliasBlueprint = newAliasBlueprint;
  }

  aliases: string[] = [];
  @Mutation
  setAliases(newAliases: string[]) {
    this.aliases = newAliases;
  }

  counts: Record<string, number> = {};
  @Mutation
  setCounts(newCounts: Record<string, number>) {
    this.counts = newCounts;
  }

  aliasPropComponents: Record<string, string[]> = {};
  @Mutation
  setAliasPropComponents(newComponents: Record<string, string[]>) {
    this.aliasPropComponents = newComponents;
  }

  @Mutation
  addAliasPropComponent(payload: {
    componentKey: string | number;
    item: string;
  }) {
    const newAliasComponents = deepAssign({}, this.aliasPropComponents);
    if (!(payload.componentKey in newAliasComponents))
      newAliasComponents[payload.componentKey] = [];
    newAliasComponents[payload.componentKey].push(payload.item);
    this.aliasPropComponents = newAliasComponents;
  }

  @Mutation
  removeAliasPropComponent(componentKey: string, index: number) {
    const newAliasComponents = deepAssign({}, this.aliasPropComponents);
    if (!(componentKey in newAliasComponents)) return false;
    if (newAliasComponents[componentKey].length <= index) return false;
    newAliasComponents[componentKey].splice(index, 1);
    this.setAliasPropComponents(newAliasComponents);
  }

  @Mutation
  save(): void {
    localStorage.setItem("RootModule", JSON.stringify(store.state));
  }

  @Mutation
  load(): void {
    const loadState = { RootModule: defaultRootState() };
    const savedStateString = localStorage.getItem("RootModule");
    if (savedStateString)
      store.replaceState(deepAssign(loadState, JSON.parse(savedStateString)));
  }
}

export const rootModule = getModule(RootModule);

store.subscribe(({ type }) => {
  if (!["RootModule/save", "RootModule/load"].includes(type)) {
    dispatch(rootModule.save, 1000);
  }
});
