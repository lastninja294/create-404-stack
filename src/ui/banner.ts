import figlet from 'figlet';
import gradient from 'gradient-string';

export async function showBanner() {
  const msg = figlet.textSync('Create 404 Stack', {
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  console.log(gradient.retro.multiline(msg));
}
