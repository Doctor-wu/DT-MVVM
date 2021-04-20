import {View, Modal} from "../../src";
import {formatTime} from "../../src/utils/util";

const baseView = new View();
const baseModal = new Modal({
    books: [
        {
            name: 'JavaScript',
            color: 'yellow'
        },
        {
            name: 'Typescript',
            color: 'blue'
        }
    ],
    obj:{},
    myName: 'Doctorwu',
    guest: 'Yoki',
    date: formatTime(new Date(Date.now()+8*3600000).toISOString()+8*3600000),
    item: {}
});
baseView.render(baseModal, '#app');

(window as any).modal = baseModal.getModal();
// setInterval(() => {
//     baseModal.getModal().date = formatTime(new Date(Date.now()+8*3600000).toISOString()+8*3600000);
// }, 1000)
