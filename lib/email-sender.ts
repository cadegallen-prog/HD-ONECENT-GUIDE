import { Resend } from "resend"
import { render } from "@react-email/components"
import WeeklyDigest from "@/emails/weekly-digest"

interface ProcessedItem {
  sku: string
  name: string
  brand: string | null
  imageUrl: string | null
  homeDepotUrl: string | null
  retailPrice: string | null
  locations: Record<string, number>
}

interface EmailStats {
  itemCount: number
  reportCount: number
  mostActiveState: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Sends a weekly digest email to a single subscriber
 *
 * @param resendApiKey - Resend API key
 * @param to - Recipient email address
 * @param items - Array of processed penny items
 * @param stats - Summary statistics
 * @param unsubscribeUrl - Full unsubscribe URL with token
 * @param weekStartDate - Start date of the weekly digest period
 * @returns Promise<SendEmailResult> - Result of the send operation
 */
export async function sendWeeklyDigest(
  resendApiKey: string,
  to: string,
  items: ProcessedItem[],
  stats: EmailStats,
  unsubscribeUrl: string,
  weekStartDate: Date
): Promise<SendEmailResult> {
  try {
    const resend = new Resend(resendApiKey)

    // Render the email template
    const emailHtml = await render(
      WeeklyDigest({
        items,
        stats,
        unsubscribeUrl,
        weekStartDate,
      })
    )

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Penny Central <updates@pennycentral.com>",
      to,
      subject: `Weekly Penny List: ${stats.itemCount} New Items This Week`,
      html: emailHtml,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message || String(error),
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    // Handle rendering or other errors
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Rate limiting delay helper
 *
 * @param ms - Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
