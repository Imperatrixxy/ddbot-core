import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const permissionSchema = new Schema({
    _id: { $type: String, required: true },
    permissions: [
        {
            _id: false,
            type: { $type: Number, required: true },
            permission: { $type: Boolean, required: true },
            id: { $type: String, required: true }
        }
    ],
    commands: [
        {
            id: String,
            name: { $type: String, required: true },
            permissions: [
                {
                    _id: false,
                    type: { $type: Number, required: true },
                    permission: { $type: Boolean, required: true },
                    id: { $type: String, required: true }
                }
            ]
        }
    ]
}, { typeKey: '$type'});

const name = 'guild-permissions';
export default models[name] || model(name, permissionSchema);

const storedCmdStructure = {
    _id: '1234567890123456789', //Guild ID
    commands: [
        {
            id: '1234567890123456789', //Optional, used if slash command.
            name: 'cmdname',
            permissions: [
                {
                    type: 1, //Role
                    permission: false, //Deny access
                    id: '1234567890123456789' //Role ID
                },
                {
                    type: 2, //User
                    permission: true, //Allow access
                    id: '1234567890123456789' //User ID
                },
            ],
        } 
    ],
}