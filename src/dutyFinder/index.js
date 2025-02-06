import dutySchema from '../models/dutySchema';

async function findDuty(duty) {
    if (!duty) return {error: 'Please provide a duty.'}

    let item = await dutySchema.findById(duty.toLowerCase());

    if (item) {
        const result = JSON.stringify(item).json();
        console.log(result);
        return;
    }

}