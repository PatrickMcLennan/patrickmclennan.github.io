import ReactDOM from 'react-dom';
import './styles/resets.scss';
import { App } from './App';

function showError() {
  const h1 = document?.createElement?.(`h1`);
  if (!h1) {
    return console.error(`Literally everything is broken, can't even create vanilla error message`);
  }
  h1.textContent = `This website is currently down, please try some other time.`;
  return document.body.appendChild(h1);
}

const ROOT = document?.querySelector?.(`#ROOT`);
if (!ROOT || !ReactDOM?.render) showError();
else ReactDOM.render(App(), ROOT);
