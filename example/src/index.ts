import {View, Modal} from "../../src";
import {formatTime} from "../../src/utils/util";

const baseView = new View();
const baseModal = new Modal({
    books: [
        {
            name: 'JavaScript',
            color: 'gold'
        },
        {
            name: 'Typescript',
            color: 'darkblue'
        },
        {
            name: 'NodeJS',
            color: 'green'
        },
        {
            name: 'CSS',
            color: 'skyblue'
        },
    ],
    obj:{},
    myName: 'Doctorwu',
    guest: 'Yoqi',
    date: formatTime(new Date(Date.now()+8*3600000).toISOString()+8*3600000),
});
baseView.render(baseModal, '#app');

(window as any).modal = baseModal.getModal();
baseModal.getModal().guest = "Yoki"
// setInterval(() => {
//     baseModal.getModal().date = formatTime(new Date(Date.now()+8*3600000).toISOString()+8*3600000);
// }, 1000)
