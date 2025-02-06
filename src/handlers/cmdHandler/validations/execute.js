export default function({ name, execute }) {
    if(!execute) {
        throw new Error(name, 'The command does not have an execute function attached to it.');
    }

    if(typeof execute !== 'function') {
        throw new Error(name, `The command's execute property needs to be a function.`);
    }
}