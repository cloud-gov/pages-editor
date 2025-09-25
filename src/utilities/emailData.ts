export function generateUserInvitationEmailData(userEmail: string, siteName: string, invitorName: string) {
  return {
    to: userEmail,
    subject: `You've been invited to join ${siteName} on Pages Editor`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've been invited to join ${siteName} on Cloud Pages Pro</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
        
        <!-- Header with logos -->
        <div style="padding: 16px 0 8px; border-bottom: 1px solid #e1e5e9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="text-align: center;">
                <a href="${process.env.PUBLIC_URL}" style="text-decoration: none; display: inline-block;">
                  <img src="${process.env.PUBLIC_URL}/assets/images/cloud-pages-horizontal.png" 
                    alt="Cloud Pages" 
                    style="height: 48px; width: auto;">
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 24px;">
          <h1 style="font-size: 24px; margin: 0 0 16px 0; text-align: center;">
            You've been invited to join <strong>${siteName}</strong> on Cloud Pages Pro
          </h1>
          
          <div style="background: #f8f9fa; padding: 16px; margin: 16px 0;">
            <h2 style="margin: 0 0 8px 0; font-size: 16px;"><strong>Invitation Details</strong></h2>
            <p style="margin: 0 0 4px 0;"><strong>Invited by:</strong> ${invitorName}</p>
            <p style="margin: 0 0 4px 0;"><strong>Site:</strong> ${siteName}</p>
          </div>
          
          <p style="font-size: 16px; margin: 16px 0;">To get started on Cloud Pages Pro, log in with your credentials:</p>
          
          <!-- Main CTA Button -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.PUBLIC_URL}/admin" 
               style="background: #005ea2; color: white; padding: 16px 32px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold;">
              Log in to ${siteName}
            </a>
          </div>
          
          <!-- Getting Started Info -->
          <div style="background: #f8f9fa; padding: 16px; margin: 16px 0;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px;">What you can do:</h3>
            <ul style="margin: 0; padding-left: 24px;">
              <li>Create and edit pages, posts, and news articles</li>
              <li>Manage media files and documents</li>
              <li>Organize content with categories and tags</li>
              <li>Preview changes before publishing</li>
              <li>Collaborate with your team</li>
            </ul>
          </div>
          
          <!-- Support Information -->
          <div style="padding: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>We're here to help.</strong> If you need support, please contact your site administrator:</p>
            <p style="margin: 0; font-size: 14px;">
              <a href="mailto:pages-support@cloud.gov" style="color: #005ea2;">pages-support@cloud.gov</a>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 16px; border-top: 1px solid #e1e5e9; font-size: 12px; color: #666; text-align: center;">
          <p style="margin: 0 0 8px 0;">
            Cloud.gov Pages Pro is a product of the General Services Administration, 1800 F Street NW, Washington, DC 20405.
            You can manage all of your subscriptions and unsubscribe from emails here.
          </p>
          <p style="margin: 0;">
            This is an automated message from Cloud.gov Pages Pro
          </p>
        </div>
      </body>
      </html>
    `
  }
}
