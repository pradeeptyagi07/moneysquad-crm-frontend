"use client"

import React from "react"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Close as CloseIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Gavel as GavelIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material"

interface DocumentAgreementDialogProps {
  open: boolean
  onClose: () => void
  onAccept: () => void
  loading?: boolean
}

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      style={{ height: "100%", display: value === index ? "flex" : "none", flexDirection: "column" }}
      {...other}
    >
      {children}
    </div>
  )
}

const DocumentAgreementDialog: React.FC<DocumentAgreementDialogProps> = ({
  open,
  onClose,
  onAccept,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [allDocumentsAccepted, setAllDocumentsAccepted] = useState(false)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleAcceptanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllDocumentsAccepted(event.target.checked)
  }

  const handleAccept = () => {
    if (allDocumentsAccepted && !loading) {
      onAccept()
    }
  }

  // Reset checkbox when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setAllDocumentsAccepted(false)
      setActiveTab(0)
    }
  }, [open])

  const documents = [
    {
      id: "partnerAgreement",
      title: "Partner Service Agreement",
      icon: <GavelIcon sx={{ fontSize: 18 }} />,
      color: "#2563eb",
      content: `MoneySquad Partner Service Agreement [last updated 30th June, 2025]

Effective Date: Same as Acceptance or registration date.

Introduction
By registering as a Partner on the MoneySquad Partner Platform (https://app.moneysquad.in), you ("Partner") agree to the following Partner Service Agreement ("Agreement") with:

Altmoney Technologies Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at 935, 9th Floor, Westend Mall, Janakpuri, Delhi – 110058 (hereinafter referred to as "Altmoney", which owns and operates the brand MoneySquad®, a registered trademark).

1. Purpose
This Agreement governs your engagement as a Partner for sourcing and referring eligible leads for financial/ loan products—such as but not limited to Personal Loans, Business Loans, Professional Loans, and Overdrafts—through the MoneySquad® team or the partner platform.

2. Acceptance
By checking the box during signup and clicking 'Register/Sign-up', you:
- Confirm that you have read, understood, and agree to the terms of this Agreement.
- Acknowledge this constitutes a legally binding contract under the Indian Contract Act, 1872 and the Information Technology Act, 2000 or any amendments to these acts.
- Provide consent to receive transactional and partner-related communication via SMS, email, WhatsApp, or phone.

3. Term & Termination
- This Agreement is valid from the date of acceptance until terminated by either party.
- Either party may terminate this Agreement with 15 days' prior notice.
- Altmoney may terminate this Agreement immediately in case of breach, fraud, misrepresentation, or regulatory violations by the Partner.

4. Partner Responsibilities
You agree to:
- Source and submit only genuine, accurate, and consenting borrower leads.
- Share/email/upload accurate and unaltered documents including KYC, bank statements, ITRs, etc.
- Maintain the integrity, transparency, and professionalism expected under this Agreement.
- Never impersonate any employee or representative of MoneySquad®, Altmoney, or any lending partner.

5. Payouts & Commission Policy
Commission is paid only on successful disbursal of loans sourced by the Partner.
- The payout structure shall be shared via the Partner Dashboard or separate annexure and may be revised from time to time.
- Payouts will be processed monthly/weekly/on-spot as may be decided mutually, after reconciliation with lending partners.
- Payouts will be withheld or clawed back if:
  • The loan is cancelled within 30 days of disbursal.
  • The borrower defaults in the first EMI or within 30 days. Or The borrower defaults during loan tenure and lender claws back the Payout from Altmoney.
  • Documentation is found to be fraudulent or tampered causing penalty to Altmoney.

6. Prohibited Conduct & Fraud Policy
You shall not:
- Forge, manipulate, or fabricate documents.
- Submit dummy, non-existent, or consentless leads.
- Charge any money to the customer for lead submission, approvals, or processing.
- Misrepresent your affiliation with Altmoney or any financial institution.

If found in violation:
- Your partner account will be immediately blacklisted and deactivated.
- All unpaid commissions will be forfeited.
- Altmoney may initiate legal action, including FIRs and civil recovery suits.

7. Documentation & Compliance
- You are solely responsible for verifying the authenticity of the documents submitted.
- You must retain soft or physical copies of all documents for a minimum of 6 months.
- Any discrepancy or mismatch may lead to account suspension or legal recourse.

8. Loan Cancellation & Default
- If the borrower cancels or defaults on the loan:
  • Within 15 days post disbursal → No commission will be paid.
  • Within the first EMI period → Any already-paid commission must be refunded within 7 working days.
- Repeated cancellations or high default rates may result in delisting of the Partner.

9. Intellectual Property
- MoneySquad® is a registered trademark of Altmoney Technologies Private Limited.
- All branding, code, content, and marketing material on the platform is the sole property of Altmoney.
- You may not copy, misuse, reverse-engineer, or create derivative platforms based on any of our content or systems.

10. Confidentiality
You agree to:
- Keep all borrower, business, and partner information confidential.
- Not share, sell, or exploit any data or insights gathered through the platform.
This clause will remain in effect for 2 years post-termination of the Agreement.

11. Indemnity
You agree to fully indemnify, defend, and hold harmless Altmoney Technologies Private Limited (MoneySquad®) from and against any loss, liability, legal claim, penalty, or cost arising from:
- Your fraud, negligence, or misrepresentation.
- Disputes initiated by clients referred by you.
- Any third-party claim resulting from your conduct.

12. Dispute Resolution & Governing Law
- Any disputes shall first be attempted to be resolved amicably.
- If unresolved, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996.
- The sole arbitrator shall be appointed by Altmoney.
- Jurisdiction and seat of arbitration: New Delhi
- This Agreement shall be governed by the laws of India.

13. Legal Remedies & Penalties
In the event of fraudulent activity or breach, Altmoney may:
- File an FIR under relevant sections of the Indian Penal Code, BNS, and the Information Technology Act, 2000.
- Initiate civil proceedings to recover commissions, losses, and legal costs.

14. Nature of Agreement
- This is an independent contractor agreement. You are not an employee, franchisee, or agent of Altmoney.
- No exclusivity or minimum business guarantee is provided unless agreed separately in writing.
- Altmoney may update or revise this Agreement at any time with prior notice via email or dashboard alerts.

15. Electronic Execution
This Agreement is an electronic record as per the Information Technology Act, 2000. It does not require a physical or digital signature. Your acceptance by checkbox and submission of the registration form constitutes binding consent.`,
    },
    {
      id: "termsOfUse",
      title: "Terms of Use",
      icon: <DocumentIcon sx={{ fontSize: 18 }} />,
      color: "#7c3aed",
      content: `Terms of Use
MoneySquad (Altmoney Technologies Private Limited)

Altmoney Technologies Pvt. Ltd. ("AltMoney" or "MoneySquad", "moneysquad.in" or AltMoney Applications, including its subsidiaries or affiliated companies, henceforth also referred as 'AltMoney', 'we' or the 'Company) and its related services ("Service") subject to your compliance with the terms and conditions ("Terms of Service") set forth below. Please read the following carefully.

MoneySquad and AltMoney can be interpreted here interchangeably.

AltMoney reserves the right to update and change the Terms of Service at any time without notice. All new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service. Continued use of the Service after any such changes shall constitute your consent to said changes.

Violation of any of the terms below will result in the termination of your account. While AltMoney prohibits such conduct and content on the service, you understand and agree that AltMoney cannot be held responsible for the content posted on the Service and you may be exposed to such content. You agree to use the Service at your own risk.

Account Terms
• You must be human. Accounts registered by bots and other automated methods are not permitted.
• AltMoney may communicate with you via email regarding your account, updates, news, and other issues related to your account. You automatically get subscribed to our mailing lists and newsletters. You can choose to opt out from receiving emails.
• You are responsible for maintaining the security of your account and password. AltMoney cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
• You are responsible for all content posted and activity that occurs under your account (even if the content is user generated) - be it in the live chat, help desk, phone or social.
• We reserve the rights to accept or refuse to any potential client. We have the sole discretion on whether to allow you to register or use our services.
• You must provide your legal full name, a valid email address, primary mobile number and any other information requested in order to complete the sign up process.

Cancellation and Termination
• The account owner is the only person who can cancel an account. You are solely responsible for properly canceling your account. Any email/ phone/ contact request to cancel the account will not be entertained. Please ensure that the cancellation/deactivation requests are made only through the online control panel.
• Account cancellations typically take about 2-3 business days to be processed. Once your account is canceled, all your account information may be permanently deleted. You won't be charged again after your official cancellation date.
• AltMoney, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service, or any other AltMoney service, for any reason, at any time. Such termination of the Service will result in the deactivation or deletion of your Account or access to your Account, and the forfeiture and relinquishment of all content in your Account. AltMoney reserves the right to refuse service to anyone for any reason at any time.

Modifications to the Service and Prices
• AltMoney reserves the right to modify and discontinue, at any time and from time to time, temporarily or permanently, the Service (or any part thereof) with or without notice.
• Prices of all Services, including but not limited to subscription plan fees of the Service, are subject to change without notice from us. AltMoney shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.

Copyright and Ownership
• AltMoney or its suppliers own the intellectual property rights to any and all protectable components of the Service, including but not limited to the name of the Service, artwork and end-user interface elements contained within the Service, many of the individual features, trademarks, trade secrets, patents, copyrights on copyrightable works including code, logos, designs, ideas, content and the related documentation. You may not copy, modify, adapt, reproduce, distribute, reverse engineer, decompile, or disassemble any aspect of the Service which AltMoney or its suppliers own.
• AltMoney claims no intellectual property rights over the Content you upload or provide to the Service. However, by using the Service to send Content, you agree that others may view and share your Content.

General Conditions
• Your use of the Service, including any content, information, or functionality contained within it, is provided "as is" and "as available" with no representations or warranties of any kind, either expressed or implied, including but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. You assume total responsibility and risk for your use of this Service.
• You understand that the Service can be used for transmission of your Content, and that during processing, your Content may be transferred unencrypted over the internet.
• You understand that AltMoney uses third party vendors and hosting partners to provide necessary hardware, software, information, networking, storage, and related technology to run the service.
• You agree not to resell, duplicate, reproduce, or exploit any part of the Service without the explicit written permission of AltMoney.
• You may not use the service to store, host, or send unsolicited email (spam), chats or SMS messages. AltMoney is Anti-Spam compliant and does not authorize or permit spam to be sent out via the automation service by you. If there is evidence of spam, your services might be suspended without notice. Accidental spam must immediately be reported to AltMoney to prevent suspension.
• You may not use the service to transmit any viruses, worms, or malicious content.
• AltMoney makes no warranties regarding (i) your ability to use the Service, (ii) your satisfaction with the Service, (iii) that the Service will be available at all times, uninterrupted, and error-free (iv), the accuracy of mathematical calculations performed by the Service, and (v) that bugs or errors in the Service will be corrected.
• AltMoney, its affiliates and its sponsors are neither responsible nor liable for any direct, indirect, incidental, consequential, special, exemplary, punitive, or other damages arising out of or relating in any way to your use of the Service. Your sole remedy for dissatisfaction with the Service is to stop using the Service.
• You understand that the Service can be used for transmission of your Content, and that during processing, your Content may be transferred unencrypted over the internet.
• You understand that AltMoney uses third party vendors and hosting partners to provide necessary hardware, software, information, networking, storage, and related technology to run the service.
• You agree not to resell, duplicate, reproduce, or exploit any part of the Service without the explicit written permission of AltMoney.
• You may not use the service to store, host, or send unsolicited email (spam), chats or SMS messages. AltMoney is Anti-Spam compliant and does not authorize or permit spam to be sent out via the automation service by you. If there is evidence of spam, your services might be suspended without notice. Accidental spam must immediately be reported to AltMoney to prevent suspension.
• You may not use the service to transmit any viruses, worms, or malicious content.
• AltMoney makes no warranties regarding (i) your ability to use the Service, (ii) your satisfaction with the Service, (iii) that the Service will be available at all times, uninterrupted, and error-free (iv), the accuracy of mathematical calculations performed by the Service, and (v) that bugs or errors in the Service will be corrected.
• AltMoney, its affiliates and its sponsors are neither responsible nor liable for any direct, indirect, incidental, consequential, special, exemplary, punitive, or other damages arising out of or relating in any way to your use of the Service. Your sole remedy for dissatisfaction with the Service is to stop using the Service.
• If any provision of the Terms of Service is held invalid or otherwise unenforceable, the enforceability of the remaining provisions shall not be impaired thereby.
• AltMoney may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
• The Terms of Service sets forth the entire understanding between you and AltMoney as to the Service, and supersedes any prior agreements between you and AltMoney (including, but not limited to, prior versions of the Terms of Service).
• Any questions regarding the Terms of Service should be addressed to support@moneysquad.in.

Governing Law
These Terms shall be governed by the relevant Indian laws without regard to the principles of conflicts of law. You hereby expressly agree to submit to the exclusive personal jurisdiction of the High Court of Delhi in India for the purpose of resolving any dispute relating to Your access to or use of the Service.

Last Revised: May 15, 2025`,
    },
    {
      id: "privacyPolicy",
      title: "Privacy Policy",
      icon: <ShieldIcon sx={{ fontSize: 18 }} />,
      color: "#10b981",
      content: `Privacy Policy
MoneySquad (Altmoney Technologies Private Limited)

Altmoney Technologies Pvt. Ltd. ("AltMoney" or "MoneySquad", "moneysquad.in" or AltMoney Applications, including its subsidiaries or affiliated companies, henceforth also referred as 'AltMoney', 'we' or the 'Company) is keen on data security as we are well aware that our users (you) care about how the personal information is used. Hosted on high performing Google & Amazon clouds, we assure you that all our customer information is held confidential. We never sell our customer list or our customer information. All the customer information collected such as name, email address, phone number, social media handles, mailing address, billing information or any other information related to third party integrations is collected for the sole purpose of providing best services to our customers and to update them of the improvements to our product and services.

MoneySquad and AltMoney can be used interchangeably here.

Our Customer Information
We understand that you are trusting us with confidential information and we believe that you have a right to know our practices regarding the information we may collect and use when you use our service or interact with us in any manner. AltMoney is a cloud-based web platform that enables associated individuals and organizations to manage their customer leads. A User may be either an entity, for example a Financial Institution which has executed an agreement with Company or with AltMoney's resellers or distributors who provide company's services ("Customer") or a Customer's users for example a Customer's connectors, credit seekers of the Services or users of the Website ("End User(s)") (Customer and End User shall collectively be referred to as "Users" or "you"). This Privacy Policy describes the policies and procedures of AltMoney on the collection, use, access, correction, and disclosure of your personal information on moneysquad.in (the "Site") and our Mobile Apps, as may be introduced in future. Your personal information will include any information which, either alone or with other data, is reasonably available to Us and relates to you ("Personal Information"). This Privacy Policy also covers any of your Personal Information which is provided to Us and which is used in connection with the marketing of the services, features or content We offer (the "Services") to Our Clients and/or the support that We may give you in connection with the provision of our Services and the Mobile Apps. This Privacy Policy does not apply to any third party applications or software that can be accessed from the Site, the Services or the Mobile Apps, such as external applicant tracking systems, social media websites or partner websites ("Third Party Services"). By using our Services, you acknowledge you have read and understood this privacy policy. For data retained through the website or data processed not through the Service (i.e. contact detailed of potential customers or resumes sent to us from potential employees for the purpose of engagement with AltMoney), AltMoney is the controller (the "Controller")

We will send product updates, special offers or promotional notices via mail, email or voice broadcast, from time to time, to our customers and prospects who have expressed interest and requested such information. The customer/ prospect can always opt out from receiving such offers/ notifications by following the opt out link on the specific communication or by contacting AltMoney Technologies directly.

Sharing of your Information

Third Party Services
At times, you may be able to access other Third Party Services through the Site, for example by clicking on links to those Third Party Services from within the Site. We are not responsible for the privacy policies and/or practices of these Third Party Services, and you are responsible for reading and understanding those Third Party Services' privacy policies.

Information Shared with Our Service Providers
We may share your information with third parties who provide services to Us. These third parties are authorized to use your Personal Information only as necessary to provide these services to Us. These services may include the provision of (i) email services to send marketing communications, (ii) mapping services, (iii) customer service or support, and (iv) providing cloud computing infrastructure.

Information Shared with Our Sub-Processors
We employ and contract with people and other entities that perform certain tasks on Our behalf and who are under Our control such as an email service provider to send emails on Our behalf, mapping service providers, and customer support providers Our "Sub-Processors"). We may need to share Personal Information with Our Sub-Processors in order to provide Services to you. Unless We tell you differently, Our Sub-Processors do not have any right to use Personal Information or other information We share with them beyond what is necessary to assist Us. Transfers to subsequent third parties are covered by onward transfer agreements between AltMoney and each Sub-Processor.

Information Disclosed Pursuant to Business Transfers
In some cases, We may choose to buy or sell assets. In these types of transactions, user information is typically one of the transferred business assets. Moreover, if We, or substantially all of Our assets, Were acquired, or if We go out of business or enter bankruptcy, user information would be one of the assets that is transferred or acquired by a third party. You acknowledge that such transfers may occur, and that any acquirer of Us or Our assets may continue to use your Personal Information as set forth in this Privacy Policy. You will be notified via email and/or a prominent notice on Our Site of any change in the legal owner or uses of your Personal Information, as Well as any choices you may have regarding your Personal Information.

Information Disclosed for Our Protection and the Protection of Others
In certain situations, We may be required to disclose Personal Information in response to lawful requests by public authorities, including to meet national security or law enforcement requirements. We also reserve the right to access, read, preserve, and disclose any information as We reasonably believe is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request (ii) enforce this Privacy Policy, including investigation of potential violations hereof, (iii) detect, prevent, or otherwise address fraud, security, or technical issues; (iv) respond to user support requests; or (v) protect Our rights, property, or safety. This includes exchanging information with other companies and organizations for fraud protection and spam/malware prevention. We require all third parties to respect the security of your Personal Information and to treat it in accordance with applicable laws. We do not allow third party service providers and Sub-Processors, we share your Personal Information with, to use it for their own purposes and only permit them to process your Personal Information for specified purposes in accordance with Our instructions. Except as set forth above, you will be notified when your Personal Information is shared with third parties, and will be able to prevent the sharing of this information. Unless We otherwise have your consent, We will only share your Personal Information in the ways that are described in this Privacy Policy.

Our Customer Lead Information
Our customer lead information is tantamount to our customer information for us. All data with relation to leads generated by our customers or any other information collected automatically by our customers is held in strict confidence. We never reach out to them unsolicitedly nor do we share customer lead information to any third party.

Our Integration Partner Information
AltMoney Technologies may have integrations with third party softwares and services. We promise high data security on all the information shared by our integration partners. We collect information for integration purposes, commission checks and for tax compliance.

App's use of information received, and App's transfer of information to any other app, from Google APIs will adhere to Google's Limited Use Requirements.

Disclosure to Third Parties
We do not share or sell your personal information to third parties.

We disclose information only in the following cases:
• as required by law, such as to comply with a subpoena or a similar legal process
• when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, to investigate fraud, or to respond to a government request
• if we are involved in a merger, acquisition, or sale of all or a portion of its assets, you will be notified via email and/or a prominent notice through our app of any change in ownership or uses of your personal information, as well as any choices you may have regarding your personal information
• to any other third party with your prior consent to do so.

Data Retention
Any Customer may request information regarding the storage and retention of data ("Audit") by contacting us. AltMoney shall make reasonable efforts to respond to the Audit in a reasonable time and subject to applicable law and to the protection of Altmoney's trade secrets (Customer's personnel may be required to execute non-disclosure agreements).

AltMoney will retain data it processes on behalf of its Customers only for as long as required to provide the Service to its Customers and as necessary to comply with its legal obligations, resolve disputes and enforce its agreements. The data in AltMoney is backed up for system continuity purposes and each backup file may be stored for 90 days.

Each User must keep the appropriate backup of its data. AltMoney shall not be responsible for any deletion of data or for any breach to database or for any erroneous data unless otherwise agreed with its Customer.

After a termination of services by a customer, an automated process will begin that permanently deletes the data in 90 days. Once begun, this process cannot be reversed and data will be permanently deleted. Some data will not be deleted and shall be kept in an anonymized manner.

AltMoney collects and retains metadata and statistical information concerning the use of the Service which are not subject to the deletion procedures in this policy and may be retained by AltMoney for no more than required to conduct its business. Some data may be retained also on our third-party service providers' servers in accordance with their retention policies. You will not be identifiable from this retained metadata or statistical information.

Customer may retain Personal Information and other Data about an End User which the Controller owns and the End User may have no access to. If you have any questions about the right of the Customer to retain and process your Personal Information you should raise this directly with the Customer. You hereby agree not to assert any claim against Altmoney in this regard and waive any rights regarding such Data and Personal Information including the right to view and control such Data and Information.

Please note that some data will not be deleted and shall be kept in an anonymized manner. Some metadata and statistical information concerning the use of the Service are not subject to the deletion procedures in this policy and may be retained by AltMoney. We will not be able to identify you from this data. Some data may also be retained on our third-party service providers' servers until deleted in accordance with their privacy policy and their retention policy.

Anonymized aggregated data may be retained by AltMoney for as long as it is required to provide its services. Contracts and billing information may be retained as required by AltMoney but at least 5 years from termination or expiration of the relationship with the applicable Customer or party.

Where do we store your Data?
The Data we collect is hosted on the AWS Cloud in Mumbai and Bangalore data centers which provides advanced security features and is compliant with ISO 27001 standard. AltMoney Headquarter is based in India, all the customer data information is stored within India only.

Security and storage of information
We take great care in implementing, enforcing and maintaining the security of the Service, and our Users' Personal Information. AltMoney implements, enforces and maintains security policies to prevent the unauthorized or accidental access to or destruction, loss, modification, use or disclosure of personal data and monitor compliance of such policies on an ongoing basis. AltMoney is certified under the ISO 27001:2013.

Customer Data is protected with 256 bit encryption, bank grade security and TLS protocols. All Personal Information is stored with logical separation from information of other customers. However, we do not guarantee that unauthorized access will never occur. AltMoney takes steps to ensure that its staff who have access to personal data are honest, reliable, competent and periodically properly trained.

AltMoney shall act in accordance with its policies to promptly notify Customer in the event that any personal data processed by AltMoney on behalf of Customer is lost, stolen, or where there has been any unauthorized access to it subject to applicable law and instructions from any agency or authority. Furthermore, AltMoney undertakes to co-operate with Customer in investigating and remedying any such security breach. In any security breach involving Personal Information, AltMoney shall promptly take remedial measures, including without limitation, reasonable measures to restore the security of the Personal Information and limit unauthorized or illegal dissemination of the Personal Information or any part thereof.

AltMoney maintains documentation regarding compliance with the requirements of the law, including without limitation documentation of any known breaches and holds reasonable insurance policies in connection with data security.

The Service may, from time to time, contain links to external sites. We are not responsible for the operation, privacy policies or the content of such sites.

Your Rights associated with your information
If we are storing your personal information, you have the following rights to your information based on the services and your region.

In the event that you have provided Personal Information to Us on our website moneysquad.in, we will provide you with information about whether we hold any of your Personal Information. You may access, correct, or request deletion of your Personal Information by contacting Us at hello@moneysquad.in. We will respond to your request within a reasonable timeframe.

When acting as a service provider of Our Customer, AltMoney has no direct relationship with the individuals whose Personal Information is provided to AltMoney through the Services. An individual who is or was employed by one of Our Customers and who seeks access to, or who seeks to correct, amend, object to the processing or profiling of, or to delete his/her Personal Information in the Platform, should direct his/her query to the HR department of the Customer Organization that uses the Platform and for which he/she works or used to work if he/she cannot make the appropriate changes via its access to the Platform provided by the Customer.

Right of Access
You can request details of your Personal Information We hold. We will confirm whether We are processing your Personal Information and We will disclose additional information including the types of Personal Information, the sources it originated from, the purpose and legal basis for the processing, subject to the limitations set out in applicable laws and regulations. We will provide you free of charge with a copy of your Personal Information but We may charge you a fee to cover Our administrative costs if you request further copies of the same information.

Right of correction
At your request, We will correct incomplete or inaccurate parts of your Personal Information, although We may need to verify the accuracy of the new information you provide us.

Right to be forgotten
At your request, We will delete your Personal Information if:
• it is no longer necessary for Us to retain your Personal Information;
• you withdraw the consent which formed the legal basis for the processing of your Personal Information;
• you object to the processing of your Personal Information and there are no overriding legitimate grounds for such processing;
• the Personal Information was processed illegally;
• the Personal Information must be deleted for Us to comply with Our legal obligations.

We will decline your request for deletion if processing of your Personal Information is necessary: 1. for Us to comply with Our legal obligations; 2. for the establishment, exercise or defense of legal claims; or 3. for the performance of a task in the public interest.

Right to object
Where We rely on Our legitimate interests (or that of a third party) to process your Personal Information, you have the right to object to this processing on grounds relating to your particular situation if you feel it impacts on your fundamental rights and freedoms. We will comply with your request unless We have compelling legitimate grounds for the processing which override your rights and freedoms, or where the processing is in connection with the establishment, exercise or defense of legal claims. We will always comply with your objection to processing your Personal Information for direct marketing purposes.

Right not to be subject to decisions based solely on automated processing
You will not be subject to decisions with a legal or similarly significant effect (including profiling) that are based solely on the automated processing of your Personal Information, unless you have given Us your explicit consent or where they are necessary for the performance of a contract with Us.

Right to withdraw consent
You have the right to withdraw any consent you may have previously given Us at any time. In order to exercise your rights in this section We may ask you for certain identifying information to ensure the security of your Personal Information. To request to exercise any of the above rights, please contact Us at support@moneysquad.in. We will respond to your request within 30 days or provide you with reasons for the delay.

Usually, We will not charge you any fees in connection with the exercise of your rights. If your request is manifestly unfounded or excessive, for example, because of its repetitive character, We may charge a reasonable fee, taking into account the administrative costs of dealing with your request. If We refuse your request We will notify you of the relevant reasons.

Privacy Statement Updates
The terms of this Privacy Policy will govern the use of the Service and any information collected in connection therewith, however, AltMoney may amend or update this Privacy Policy from time to time. Changes to this Privacy Policy are effective as of the stated "Last Revised" date and your continued use of Services will constitute your active acceptance of, and agreement to be bound by, the changes to the Privacy Policy.

If you have any questions concerning this Privacy Policy, you are welcome to send us an email or otherwise contact us at support@moneysquad.in and we will make an effort to reply within a reasonable timeframe, and not over 30 business days. We encourage you to periodically review this page for the latest information on our privacy practices.

Last Revised: May 15, 2025`,
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Compact Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "white",
          p: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SecurityIcon sx={{ fontSize: 24 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                Partner Agreement & Policies
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.8rem" }}>
                Please review all documents before proceeding
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            disabled={loading}
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Fixed Tabs Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "#f8fafc",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          disabled={loading}
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              py: 1.5,
              minHeight: 48,
            },
            "& .Mui-selected": {
              color: "#2563eb !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2563eb",
              height: 2,
            },
          }}
        >
          {documents.map((doc, index) => (
            <Tab
              key={doc.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: doc.color }}>{doc.icon}</Box>
                  <span>{doc.title}</span>
                </Box>
              }
              id={`document-tab-${index}`}
              aria-controls={`document-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Content Area - Flexible Height with proper scrolling */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {documents.map((doc, index) => (
          <TabPanel key={doc.id} value={activeTab} index={index}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexShrink: 0 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${doc.color}15`,
                      color: doc.color,
                    }}
                  >
                    {doc.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {doc.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, flexShrink: 0 }} />
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f5f9",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#cbd5e1",
                      borderRadius: "3px",
                      "&:hover": {
                        backgroundColor: "#94a3b8",
                      },
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    {doc.content}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </TabPanel>
        ))}
      </Box>

      {/* Compact Footer */}
      <DialogActions
        sx={{
          p: 2,
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          flexShrink: 0,
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1.5,
        }}
      >
        {!allDocumentsAccepted && !loading && (
          <Alert
            severity="warning"
            sx={{
              borderRadius: 1,
              fontSize: "0.875rem",
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            Please read and accept all documents to proceed with your partner account.
          </Alert>
        )}

        {loading && (
          <Alert
            severity="info"
            sx={{
              borderRadius: 1,
              fontSize: "0.875rem",
              "& .MuiAlert-message": {
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
              },
            }}
          >
            <CircularProgress size={16} />
            Processing your agreement acceptance...
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allDocumentsAccepted}
                onChange={handleAcceptanceChange}
                disabled={loading}
                sx={{
                  color: "#2563eb",
                  "&.Mui-checked": {
                    color: "#2563eb",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 20,
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: allDocumentsAccepted ? "#065f46" : "#991b1b",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                I have read, understood, and agree to all the above documents
              </Typography>
            }
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              size="small"
              disabled={loading}
              sx={{
                borderColor: "#d1d5db",
                color: "#6b7280",
                fontWeight: 500,
                px: 2,
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
                "&:disabled": {
                  borderColor: "#e5e7eb",
                  color: "#9ca3af",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!allDocumentsAccepted || loading}
              variant="contained"
              size="small"
              sx={{
                background:
                  allDocumentsAccepted && !loading ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#d1d5db",
                color: "white",
                fontWeight: 600,
                px: 3,
                boxShadow: allDocumentsAccepted && !loading ? "0 2px 8px 0 rgba(16, 185, 129, 0.3)" : "none",
                "&:hover": {
                  background:
                    allDocumentsAccepted && !loading ? "linear-gradient(135deg, #059669 0%, #047857 100%)" : "#d1d5db",
                  boxShadow: allDocumentsAccepted && !loading ? "0 4px 12px 0 rgba(16, 185, 129, 0.4)" : "none",
                },
                "&:disabled": {
                  color: "white",
                  background: "#d1d5db",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Processing...
                </Box>
              ) : allDocumentsAccepted ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  Accept & Continue
                </Box>
              ) : (
                "Accept All Documents"
              )}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentAgreementDialog
