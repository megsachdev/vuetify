// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'

// Helpers
import { RGBAtoHSVA, HSVAtoRGBA, HSVA, HSVAtoHSLA, HSLAtoHSVA, colorEqual, HexToHSVA, HSVAtoHex } from '../../util/colorUtils'
import { padEnd, chunk } from '../../util/helpers'

// Types
import Vue, { VNode } from 'vue'
import { PropValidator } from 'vue/types/options'

type Input = [string, number, number, string]

type Mode = {
  name: string
  inputs: Input[]
  from: Function
  to: Function
}

export default Vue.extend({
  name: 'v-color-picker-edit',

  props: {
    color: Array as PropValidator<HSVA>
  },

  data: () => ({
    internalColor: [0, 0, 0, 1] as any[],
    modes: [
      {
        name: 'rgba',
        inputs: [
          ['r', 0, 255, 'int'],
          ['g', 1, 255, 'int'],
          ['b', 2, 255, 'int'],
          ['a', 3, 1, 'float']
        ],
        from: RGBAtoHSVA,
        to: HSVAtoRGBA
      },
      {
        name: 'hsla',
        inputs: [
          ['h', 0, 360, 'int'],
          ['s', 1, 1, 'float'],
          ['l', 2, 1, 'float'],
          ['a', 3, 1, 'float']
        ],
        from: HSLAtoHSVA,
        to: HSVAtoHSLA
      },
      {
        name: 'hex',
        from: HexToHSVA,
        to: HSVAtoHex
      }
    ] as Mode[],
    mode: 'rgba'
  }),

  computed: {
    currentMode (): Mode {
      const index = this.modes.findIndex(m => m.name === this.mode)
      return this.modes[index]
    }
  },

  watch: {
    color: {
      handler (v: number[]) {
        this.internalColor = this.currentMode.to(v)
      },
      immediate: true
    },
    internalColor: {
      handler (v: number[]) {
        const hsva = this.currentMode.from(v)
        if (colorEqual(hsva, this.color)) return
        this.$emit('update:color', hsva)
      }
    }
  },

  methods: {
    getValue (v: any, type: string) {
      if (type === 'float') return Math.round(v * 100) / 100
      else if (type === 'int') return Math.round(v)
      else return 0
    },
    parseValue (v: string, type: string) {
      if (type === 'float') return parseFloat(v)
      else if (type === 'int') return parseInt(v, 10) || 0
      else return 0
    },
    changeMode () {
      const value = this.currentMode.from(this.internalColor)
      const index = this.modes.findIndex(m => m.name === this.mode)
      const newMode = this.modes[(index + 1) % this.modes.length]
      this.mode = newMode.name
      this.internalColor = newMode.to(value)
    },
    genInput (target: string, attrs: any, value: any, change: (e: Event) => void): VNode {
      return this.$createElement('div', {
        staticClass: 'v-color-picker__input'
      }, [
        this.$createElement('input', {
          key: target,
          attrs,
          domProps: {
            value
          },
          on: {
            change
          }
        }),
        this.$createElement('span', target.toUpperCase())
      ])
    },
    genInputs (): VNode[] | VNode {
      switch (this.currentMode.name) {
        case 'hex': return this.genInput(
          this.currentMode.name,
          {
            maxlength: 9
          },
          `#${this.internalColor.join('')}`,
          (e: Event) => {
            const el = e.target as HTMLInputElement
            const newVal = padEnd(padEnd(el.value, 7), 9, 'F')
            if (newVal.indexOf('#') < 0) return
            this.internalColor = chunk(newVal.split('#')[1], 2)
          }
        )
        default: return this.currentMode.inputs.map(([target, index, max, type]) => this.genInput(
          target,
          {
            type: 'number',
            min: 0,
            max,
            step: type === 'float' ? '0.01' : type === 'int' ? '1' : undefined
          },
          this.getValue(this.internalColor[index], type),
          (e: Event) => {
            const el = e.target as HTMLInputElement
            const newVal = this.parseValue(el.value || '0', type)
            this.internalColor = this.internalColor.map((oldVal: number, i: number) => i === index ? newVal : oldVal)
          }
        ))
      }
    },
    genSwitch (): VNode {
      return this.$createElement(VBtn, {
        props: {
          small: true,
          icon: true
        },
        on: {
          click: this.changeMode
        }
      }, [
        this.$createElement(VIcon, '$vuetify.icons.unfold')
      ])
    }
  },

  render (h): VNode {
    return h('div', {
      staticClass: 'v-color-picker__edit'
    }, [
      this.genInputs(),
      this.genSwitch()
    ])
  }
})