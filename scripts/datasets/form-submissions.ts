import type { SiteFormSubmission } from '@/payload-types'
import { generateRandomInt } from './utils'

// Sample data for generating realistic submissions
const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'David',
  'Elizabeth',
  'William',
  'Barbara',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Charles',
  'Karen',
  'Christopher',
  'Lisa',
  'Daniel',
  'Nancy',
]

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
]

const subjects = [
  'Question about services',
  'Feedback on your website',
  'General inquiry',
  'Partnership opportunity',
  'Technical support needed',
  'Request for information',
  'Accessibility concern',
  'Complaint',
  'Compliment',
  'Other',
]

const messages = [
  'I have a question about the services you offer. Could someone please contact me to discuss further?',
  'I wanted to reach out and provide some feedback on my recent experience with your website. Overall it was great!',
  'Hello, I am trying to find more information about your programs. Can you point me in the right direction?',
  'We are interested in exploring a potential partnership. Please let us know if this is something you would consider.',
  'I am having trouble accessing some of the documents on your site. Can you help?',
  'Could you please send me more information about your upcoming initiatives?',
  'I noticed that some of the content on your site may not be fully accessible to screen readers. Wanted to bring this to your attention.',
  'I had a negative experience and would like to file a formal complaint. Please contact me at your earliest convenience.',
  'Just wanted to say thank you for the excellent service! Your team has been incredibly helpful.',
  'I have a general question that does not fit any of the other categories. Please reach out when you have a moment.',
  'I am a federal employee looking for guidance on your policies. Can someone from your team assist?',
  'Our organization would like to learn more about how we can collaborate with your agency.',
  'I tried to submit a form earlier but received an error. Can you check if my submission went through?',
  'Thank you for the quick response to my previous inquiry. I have a follow-up question.',
  'I am researching government services and would appreciate any materials you can share.',
]

const statuses: Array<'pending' | 'reviewed' | 'spam' | 'archived'> = [
  'pending',
  'reviewed',
  'spam',
  'archived',
]

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const generateRandomEmail = (firstName: string, lastName: string): string => {
  const domains = ['example.gov', 'test.gov', 'agency.gov', 'federal.gov', 'mail.gov']
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName[0].toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
  ]
  return `${pick(formats)}@${pick(domains)}`
}

const generateRandomDate = (daysBack: number): string => {
  const now = new Date()
  const randomDays = Math.floor(Math.random() * daysBack)
  const randomHours = Math.floor(Math.random() * 24)
  const randomMinutes = Math.floor(Math.random() * 60)
  now.setDate(now.getDate() - randomDays)
  now.setHours(randomHours, randomMinutes, 0, 0)
  return now.toISOString()
}

const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
]

/**
 * Generates random form submissions for a given form
 * @param formId - The ID of the form these submissions belong to
 * @param siteId - The ID of the site
 * @param count - Number of submissions to generate (default: 10)
 */
const formSubmissions = (
  formId: number,
  siteId: number,
  count: number = 10,
): Partial<SiteFormSubmission>[] => {
  const submissions: Partial<SiteFormSubmission>[] = []

  for (let i = 0; i < count; i++) {
    const firstName = pick(firstNames)
    const lastName = pick(lastNames)
    const fullName = `${firstName} ${lastName}`
    const email = generateRandomEmail(firstName, lastName)
    const submittedAt = generateRandomDate(30) // Random date within last 30 days

    // Weight status distribution: more pending/reviewed, fewer spam/archived
    const statusWeights = { pending: 0.4, reviewed: 0.35, spam: 0.15, archived: 0.1 }
    const rand = Math.random()
    let status: 'pending' | 'reviewed' | 'spam' | 'archived' = 'pending'
    let cumulative = 0
    for (const [s, weight] of Object.entries(statusWeights)) {
      cumulative += weight
      if (rand < cumulative) {
        status = s as typeof status
        break
      }
    }

    submissions.push({
      id: generateRandomInt(),
      form: formId,
      site: siteId,
      status,
      data: {
        name: fullName,
        email,
        subject: pick(subjects),
        message: pick(messages),
      },
      metadata: {
        submittedAt,
      },
      updatedAt: submittedAt,
      createdAt: submittedAt,
    })
  }

  // Sort by date (newest first)
  submissions.sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime()
    const dateB = new Date(b.createdAt || '').getTime()
    return dateB - dateA
  })

  return submissions
}

export default formSubmissions
