import { snsClient, PublishCommand } from './aws-client-sdk.mjs';
import { TOPIC_ARN, MESSAGE_GROUP_ID } from '../contants/const.mjs';

export default class EventPublisher {
    async sendMessage(message) {
        const input = {
            Message: JSON.stringify(message),
            TopicArn: TOPIC_ARN,
            MessageGroupId: MESSAGE_GROUP_ID,
        }
    
        const command = new PublishCommand(input);
        await snsClient.send(command);
    }
}