<template>
  <b-button :icon-left="iconName" class="network-button" data-test="button_network" @click="onClick">{{
    shortNetworkName
  }}</b-button>
</template>

<script>
import { mapGetters } from 'vuex'
import NetworkModal from '@/components/NetworkModal'
export default {
  computed: {
    ...mapGetters('metamask', ['networkName', 'netId']),
    iconName() {
      return `${this.networkName}`.replace(/\)?\s\(?/g, '-').toLowerCase()
    },
    shortNetworkName() {
      switch (this.netId) {
        case 52014:
          return 'Electroneum'
        case 5201420:
          return 'Electroneum Testnet'
        default:
          return this.networkName
      }
    }
  },
  methods: {
    onClick() {
      this.$buefy.modal.open({
        parent: this,
        component: NetworkModal,
        hasModalCard: true,
        width: 440
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.network-button {
  padding-left: 0;
  border: 0;
  background-color: #242424;

  &:hover {
    color: #fff;
    background-color: #393939;
  }

  ::v-deep .icon {
    height: 2.857em;
    width: 2.857em;
    background-color: #0f1f19;
    border: 1px solid #01e4ff;
    border-radius: 4px;

    &:first-child:not(:last-child) {
      margin-right: 1em;
    }

    .trnd {
      background-color: #01e4ff;
    }
  }
}
</style>
