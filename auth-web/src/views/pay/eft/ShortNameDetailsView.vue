<template>
  <v-container
    id="shortname-details"
    class="view-container"
  >
    <v-snackbar
      id="linked-account-snackbar"
      v-model="snackbar"
      :timeout="4000"
      transition="fade"
    >
      {{ snackbarText }}
    </v-snackbar>
    <div class="view-header flex-column">
      <h1 class="view-header__title">
        {{ unsettledAmountHeader }}
      </h1>
      <p class="mt-3 mb-0">
        Review and verify short name details
      </p>
    </div>

    <ShortNameAccountLink
      class="mb-12"
      :shortNameDetails="shortNameDetails"
      :highlightIndex="highlightIndex"
      @on-link-account="onLinkAccount"
    />

    <ShortNameTransactions
      :shortNameDetails="shortNameDetails"
    />
  </v-container>
</template>
<script lang="ts">
import { PropType, computed, defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import CommonUtils from '@/util/common-util'
import PaymentService from '@/services/payment.services'
import ShortNameAccountLink from '@/components/pay/eft/ShortNameAccountLink.vue'
import ShortNameTransactions from '@/components/pay/eft/ShortNameTransactions.vue'

export default defineComponent({
  name: 'ShortNameMappingView',
  components: { ShortNameAccountLink, ShortNameTransactions },
  props: {
    shortNameId: {
      type: String as PropType<string>,
      default: null
    }
  },
  setup (props) {
    const state = reactive({
      shortNameDetails: {},
      highlightIndex: -1,
      snackbar: false,
      snackbarText: ''
    })

    onMounted(async () => {
      await loadShortname(props.shortNameId)
    })

    const unsettledAmountHeader = computed<string>(() => {
      const details = state.shortNameDetails
      const unsettledAmount = details.creditsRemaining !== undefined
        ? CommonUtils.formatAmount(details.creditsRemaining) : ''
      return `Unsettled Amount for ${details.shortName}: ${unsettledAmount}`
    })

    async function onLinkAccount (account: any, results: Array<any>) {
      const indexOf = results.findIndex((result) => result.id === account.id)
      await loadShortname(props.shortNameId)
      state.snackbarText = `Bank short name ${state.shortNameDetails.shortName} was successfully linked.`
      state.highlightIndex = indexOf
      state.snackbar = true

      setTimeout(() => {
        state.highlightIndex = -1
      }, 4000)
    }

    async function loadShortname (shortnameId: string): Promise<void> {
      try {
        const response = await PaymentService.getEFTShortnameSummary(shortnameId)
        if (response?.data) {
          state.shortNameDetails = response.data['items'][0]
        } else {
          throw new Error('No response from getEFTShortname')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to getEFTShortname.', error)
      }
    }

    return {
      ...toRefs(state),
      onLinkAccount,
      formatCurrency: CommonUtils.formatAmount,
      unsettledAmountHeader
    }
  }
})
</script>

<style lang="scss" scoped>
@import '$assets/scss/theme.scss';

</style>
