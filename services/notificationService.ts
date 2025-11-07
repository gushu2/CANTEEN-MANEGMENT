
/**
 * Simulates sending an SMS notification.
 * In a real-world application, this function would integrate with an SMS gateway
 * service like Twilio, Vonage, or AWS SNS. It would make a secure API call
 * using credentials stored in environment variables.
 *
 * @param phoneNumber The recipient's phone number.
 * @param message The text message to send.
 * @returns A promise that resolves when the simulation is complete.
 */
export const sendSmsNotification = (phoneNumber: string, message: string): Promise<void> => {
  console.log(`SIMULATING SMS to ${phoneNumber}: "${message}"`);
  
  // For this demo, we'll show a browser alert to make the simulation obvious to the user.
  // This confirms that the logic to send an SMS has been triggered correctly.
  setTimeout(() => {
    alert(`[SMS Notification Sent]\n\nTo: ${phoneNumber}\n\nMessage: ${message}`);
  }, 500); // A small delay to make it feel more like a real notification.
  
  return Promise.resolve();
};
