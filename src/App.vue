<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        Gmail Alias Manager
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-card>
          <v-card-title>
            Alias Manager
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Main Address"
              v-model="address"
              suffix="@gmail.com"
            ></v-text-field>
            <v-text-field
              label="Alias Blueprint"
              v-model="aliasBlueprint"
              :hint="aliasPreview"
              persistent-hint
              :prefix="`${address}+`"
              suffix="@gmail.com"
            ></v-text-field>
            <v-card-subtitle>
              Alias Builder
            </v-card-subtitle>
            <v-input append-icon="mdi-plus" @click:append="addAlias">
              <span>{{ address }}+</span>
              <template v-for="(component, index) in aliasComponents">
                <span
                  :key="`${component.type}+${index}`"
                  v-if="component.type === 'plain'"
                  >{{ component.char }}</span
                >
                <v-chip
                  :ripple="false"
                  :key="`${component.type}+${index}`"
                  v-if="
                    component.type === 'prop' && component.prop === 'timestamp'
                  "
                  ><span>timestamp:</span
                  ><strong>{{ component.char(aliasBinding) }}</strong></v-chip
                >
              </template>
              +<v-chip :ripple="false"
                ><span>count:</span
                ><strong>{{
                  countForAlias(compiledAliasComponent) + 1
                }}</strong></v-chip
              >
              <span>@gmail.com</span>
            </v-input>
            <v-list rounded>
              <v-list-item-title>Aliases</v-list-item-title>
              <v-list-item
                v-for="(alias, index) in aliases"
                :key="alias"
                selectable
                @click="copyToClipboard(alias)"
              >
                <v-list-item-content>
                  {{ alias }}
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-clipboard</v-icon>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn icon @click="removeAlias(index)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
    <v-snackbar v-model="showCopiedSnackbar" :timeout="3000">
      Copied!
      <v-btn dark text @click="showCopiedSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rootModule } from "@/store/root";
import { formatCompiler, parseFormat, PropComponent } from "@/util/string";

@Component
export default class App extends Vue {
  showCopiedSnackbar = false;

  aliasComponentData: Record<string, string> = {};

  get aliasBlueprint(): string {
    return rootModule.aliasBlueprint;
  }

  set aliasBlueprint(newAliasBlueprint: string) {
    rootModule.setAliasBlueprint(newAliasBlueprint);
  }

  get aliasComponents() {
    return parseFormat(this.aliasBlueprint);
  }

  get aliasCompiler() {
    return formatCompiler(this.aliasComponents);
  }

  get aliasPreview(): string {
    return `${this.address}+${this.aliasCompiler(
      this.aliasBinding
    )}+1@gmail.com`;
  }

  get aliasComponentObject() {
    return this.aliasComponents
      .filter(component => component.type === "prop")
      .map(component => [(component as PropComponent).prop, ""]);
  }

  get compiledAliasComponent(): string {
    return `${this.address}+${this.aliasCompiler(
      Object.assign(
        this.aliasBinding,
        this.aliasComponentObject,
        this.aliasComponentData
      )
    )}`;
  }

  countForAlias(alias: string): number {
    return alias in rootModule.counts ? rootModule.counts[alias] : 0;
  }

  get aliasBinding() {
    return {
      timestamp: this.timestamp
    };
  }

  get address() {
    return rootModule.address;
  }

  set address(newAddress: string) {
    rootModule.setAddress(newAddress);
  }

  addAlias() {
    const newAliases = Array.from(this.aliases);
    const newAlias = `${this.compiledAliasComponent}+${this.countForAlias(
      this.compiledAliasComponent
    ) + 1}@gmail.com`;
    rootModule.setCounts(
      Object.assign(rootModule.counts, {
        [this.compiledAliasComponent]:
          this.countForAlias(this.compiledAliasComponent) + 1
      })
    );
    newAliases.push(newAlias);
    this.aliases = newAliases;
  }

  get aliases() {
    return rootModule.aliases;
  }

  set aliases(newAliases) {
    rootModule.setAliases(newAliases);
  }

  removeAlias(aliasIndex: number) {
    const newAliases = Array.from(this.aliases);
    newAliases.splice(aliasIndex, 1);
    this.aliases = newAliases;
  }

  get timestamp(): string {
    const now = new Date();
    const year = this.zeroPad(now.getFullYear(), 4);
    const month = this.zeroPad(now.getMonth() + 1, 2);
    const date = this.zeroPad(now.getDate(), 2);
    return `${year}${month}${date}`;
  }

  zeroPad(num: number, padLength: number): string {
    const pad = new Array(padLength).fill(0).join("");
    return `${pad}${num}`.slice(-padLength);
  }

  copyToClipboard(text: string) {
    const pasteBoard = document.createElement("input");
    document.body.appendChild(pasteBoard);
    pasteBoard.value = text;
    pasteBoard.select();
    document.execCommand("copy");
    document.body.removeChild(pasteBoard);
    this.showCopiedSnackbar = true;
  }
}
</script>
