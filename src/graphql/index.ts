import { mergeResolvers } from '@graphql-tools/merge';
import { usersResolvers } from './users.resolvers';
import { petResolvers } from './pets.resolvers';
import { appointmentResolvers } from './appointments.resolvers';


export const resolvers = mergeResolvers([
    usersResolvers, 
    petResolvers, 
    appointmentResolvers]);
