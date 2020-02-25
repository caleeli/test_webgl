import { get } from 'lodash';

export default {
    data() {
        return {
            turno: 0,
            currentVariable: 'angle',
            currentValue: '',
            keyResolve: null,
            leftPad: ['GO', '0', '2', '4', '6', '8',],
            rightPad: ['<-', '1', '3', '5', '7', '9',],
        };
    },
    methods: {
        pressPad(key) {
            const value = this.currentValue;
            switch (key) {
                case '<-':
                    this.currentValue = this.currentValue.substr(0, value.length - 1);
                    break;
                case 'GO':
                    this.keyResolve ? this.keyResolve(value) : null;
                    break;
                default:
                    this.currentValue = this.currentValue + key;
            }
            this.currentVariable ? this.$set(this, this.currentVariable, this.currentValue) : null;
        },
        ask(name, variable, turno) {
            this.currentValue = '';
            this.currentVariable = variable;
            this.currentVariable ? this.$set(this, this.currentVariable, this.currentValue) : null;
            this.turno = turno;
            return new Promise(resolve => {
                this.keyResolve = resolve;
            });
        }
    },
    mounted() {
        console.log('inicio');
        document.addEventListener('keydown', (event) => {
            console.log('llego');
            switch (event.key) {
                case 'Enter': this.pressPad('GO'); break;
                case 'Backspace': this.pressPad('<-'); break;
                default:
                    this.leftPad.indexOf(event.key) > -1 ? this.pressPad(event.key) : null;
                    this.rightPad.indexOf(event.key) > -1 ? this.pressPad(event.key) : null;
            }
        });
    }
};
