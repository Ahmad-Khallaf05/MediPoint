'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the best appointment time
 * based on patient preferences and doctor availability.
 *
 * - suggestAppointmentTime - A function that takes patient schedule preferences and doctor availability
 *   and returns a suggested appointment time.
 * - SuggestAppointmentTimeInput - The input type for the suggestAppointmentTime function.
 * - SuggestAppointmentTimeOutput - The return type for the suggestAppointmentTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppointmentTimeInputSchema = z.object({
  patientSchedulePreferences: z
    .string()
    .describe('The patient schedule preferences, including preferred days and times.'),
  doctorAvailability: z.string().describe('The doctor availability, including available days and times.'),
});
export type SuggestAppointmentTimeInput = z.infer<typeof SuggestAppointmentTimeInputSchema>;

const SuggestAppointmentTimeOutputSchema = z.object({
  suggestedAppointmentTime: z
    .string()
    .describe('The suggested appointment time based on patient preferences and doctor availability.'),
  reasoning: z.string().describe('The reasoning behind the suggested appointment time.'),
});
export type SuggestAppointmentTimeOutput = z.infer<typeof SuggestAppointmentTimeOutputSchema>;

export async function suggestAppointmentTime(
  input: SuggestAppointmentTimeInput
): Promise<SuggestAppointmentTimeOutput> {
  return suggestAppointmentTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAppointmentTimePrompt',
  input: {schema: SuggestAppointmentTimeInputSchema},
  output: {schema: SuggestAppointmentTimeOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting the best appointment time for patients.

  Based on the patient's schedule preferences and the doctor's availability, suggest the most convenient appointment time for the patient.

  Patient Schedule Preferences: {{{patientSchedulePreferences}}}
  Doctor Availability: {{{doctorAvailability}}}

  Consider both the patient's preferences and the doctor's availability when suggesting the appointment time. Explain your reasoning.
  `,
});

const suggestAppointmentTimeFlow = ai.defineFlow(
  {
    name: 'suggestAppointmentTimeFlow',
    inputSchema: SuggestAppointmentTimeInputSchema,
    outputSchema: SuggestAppointmentTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

