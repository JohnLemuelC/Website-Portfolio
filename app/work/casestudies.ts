export type CaseStudy = {
  /** matches Project.title */
  key: string;
  kicker: string;
  client: string;
  platform: string;
  role: string;
  stack: string;
  /** the one line that sits under the title */
  summary: string;
  challenge: string[];
  built: string[];
  features: { name: string; body: string }[];
  hardPart: string;
  result: string;
  scale?: string;
  live?: { href: string; label: string };
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    key: "Housing Portal + Zoho CRM Sync",
    kicker: "Client project · Portal and CRM integration",
    client: "A UK property group",
    platform: "Web, on their existing site",
    role: "Build, integration and test suite",
    stack: "React, tRPC, TypeScript, MySQL, Zoho CRM API",
    scale: "650+ automated tests · 264 records in, 252 out",
    summary:
      "A client portal bolted onto a property group's existing site, kept in step with Zoho CRM in both directions, so the same property stops being typed twice.",
    challenge: [
      "Owners emailed properties in. Someone typed them into a spreadsheet. Someone else typed them into Zoho. Care providers rang to ask what was available and got an answer from whichever copy the person on the phone happened to open.",
      "The same house existed three times under three spellings of its address, and nobody could say which record was the real one. The fix had to run on the site they already had, without a migration and without asking the team to change how they use Zoho.",
    ],
    built: [
      "A portal on their existing site where owners submit a property and care providers shortlist and request viewings. Every submission writes to one database, and that database syncs with Zoho in both directions.",
      "Sync is the whole product. A change in either system is tagged with where it came from, so a write to Zoho does not bounce back through the webhook and get applied again. Where both sides changed the same field since the last sync, the record is held and a human picks the winner rather than the newer timestamp silently winning.",
    ],
    features: [
      { name: "Owners submit, providers shortlist", body: "Property owners put a house in, care providers filter by beds and area and request a viewing, all without an email." },
      { name: "Two way, not two copies", body: "Edit in the portal or edit in Zoho. Both land, and neither overwrites the other with stale data." },
      { name: "Address matching that caught the duplicates", body: "Normalising addresses before comparing them found 12 duplicate pairs and took 264 records down to 252." },
      { name: "Conflicts wait for a person", body: "When both sides edited the same field, the record is flagged instead of guessed. No silent data loss." },
      { name: "Viewing requests land in the pipeline", body: "A request becomes a Zoho record with the property attached, so nobody retypes it into the CRM." },
      { name: "650+ tests behind it", body: "Sync logic, conflict rules and address matching are all covered, so a change to one does not quietly break another." },
    ],
    hardPart:
      "The first version of the sync fed itself. Writing a record to Zoho fired Zoho's webhook, which wrote the change back to the portal, which counted as a local change and wrote to Zoho again. One edit became an endless loop of identical writes, and because each pass looked like legitimate traffic nothing errored. The fix was to stamp every write with its origin and a revision, and to make the receiving side drop anything it recognised as its own echo. Duplicate detection had the same shape of problem underneath it: comparing raw address strings matched almost nothing, because the same house was written three ways. Normalising the address first, then comparing, is what turned 264 records into 252.",
    result:
      "Live on the client's site. Owners submit directly, care providers self-serve, and the duplicate records that made the old spreadsheet untrustworthy are gone. The test suite runs on every change.",
  },
  {
    key: "Prism Marketing Dashboard",
    kicker: "Client project · Reporting warehouse",
    client: "A 187-account marketing agency",
    platform: "Web",
    role: "Pipeline, warehouse and front end",
    stack: "Next.js, Python, BigQuery, Google Ads API, Meta API",
    scale: "187 accounts · 5 ad platforms + 3 SEO sources · 25 views",
    summary:
      "Five ad platforms and three SEO sources pulled into one warehouse, with 25 analysis views, budget pacing, wasted-spend detection and plain English querying over the top.",
    challenge: [
      "An agency running 187 client accounts was reporting out of eight separate dashboards. Building one month of client reporting meant opening every platform, exporting, pasting into a sheet, and reconciling numbers that never quite agreed.",
      "The numbers disagreed for real reasons, not sloppy ones. Each platform counts a conversion differently, reports in its own timezone, and attributes on its own window. Anyone totalling them by hand was quietly adding up things that were not the same thing.",
    ],
    built: [
      "A daily pull from each platform's API into BigQuery, normalised on the way in. Spend converted to one currency, dates pinned to one timezone, and conversion types mapped to a shared set so a total actually means something.",
      "On top of that, 25 analysis views covering spend, pacing against budget, campaign performance and wasted spend, plus a natural language layer so someone can ask a question instead of finding the right view.",
    ],
    features: [
      { name: "Eight sources, one table", body: "Five ad platforms and three SEO sources land in the same schema every night." },
      { name: "Budget pacing", body: "Shows where an account will land by month end against what it was given, early enough to act." },
      { name: "Wasted spend detection", body: "Flags the campaigns and keywords taking budget without returning anything." },
      { name: "Account switching", body: "Any of the 187 accounts in two clicks, with date ranges, sorting and filtering across campaigns." },
      { name: "Ask it in English", body: "Questions go to a model with the warehouse schema, so the answer comes from the real rows." },
      { name: "Spend chart on hover", body: "Day by day spend with the detail on hover, instead of a static monthly number." },
    ],
    hardPart:
      "Getting the totals to be defensible. Every platform defines its own day. One reports in the account's timezone, one in UTC, one in the advertiser's local time, and a day boundary that moves by eight hours moves spend between months at the exact moment a client is reading a monthly report. Conversions were worse, because the same word means a view-through on one platform and a click-through on another, on windows from one day to thirty. Normalising on the way in rather than at query time was the call that made the rest work: every row lands pinned to one timezone with its conversion type mapped to a shared set, and the raw payload is kept alongside it so a disputed number can be traced back to what the platform actually sent.",
    result:
      "Running daily across 187 accounts. Monthly reporting that used to be a day of exports comes out of one place, and the numbers reconcile because they were made to mean the same thing before they were added up.",
  },
  {
    key: "Grace Inbound AI Receptionist",
    kicker: "Client project · Voice AI",
    client: "A land buying company",
    platform: "Phone, inbound and outbound",
    role: "Agent design, prompts and CRM integration",
    stack: "Retell AI, n8n, GoHighLevel, Twilio SMS",
    scale: "24/7 coverage · three agents live",
    summary:
      "Three voice agents on real calls. One takes inbound seller calls, one qualifies inbound real estate leads, one rings out and pre-qualifies with SMS follow-up. All three hand a clean record to the CRM.",
    challenge: [
      "A land buying company was losing sellers to voicemail. Sellers ring once, and if nobody picks up they ring the next buyer on the list. Outside office hours every call was a lost lead, and inside office hours the team was spending its day on calls that were never going to qualify.",
      "An answering service was not the answer, because the value is in the qualifying questions, not in picking up. Whoever answers has to ask about the parcel, the situation and the timeline, and get it into the CRM in a shape the team can act on the next morning.",
    ],
    built: [
      "Three agents with separate jobs. GRACE answers inbound seller calls and qualifies on the parcel and the seller's timeline. ACE handles inbound real estate enquiries and books appointments. SARAH calls out, pre-qualifies, and follows up by SMS when a call does not connect.",
      "Behind each one, an n8n workflow takes the call result and writes it to GoHighLevel as structured fields rather than a transcript dumped in a note. The transcript is kept, but the fields are what the pipeline runs on.",
    ],
    features: [
      { name: "Answers every call", body: "No voicemail, no office hours, no queue. A seller ringing at 2am gets the same qualifying conversation." },
      { name: "Qualifies, not just answers", body: "Asks about the parcel, the situation and the timeline, and knows which answers end the call politely." },
      { name: "Outbound with SMS follow-up", body: "SARAH rings out and texts the ones who do not pick up, so a lead is not dropped after one attempt." },
      { name: "Clean CRM records", body: "Structured fields in GoHighLevel, not a wall of transcript for someone to read through." },
      { name: "Books appointments directly", body: "ACE puts qualified enquiries straight on the calendar rather than promising a callback." },
      { name: "Full transcript kept", body: "Every call is recorded and transcribed, so a disputed answer can be checked." },
    ],
    hardPart:
      "GoHighLevel will not store what you compose. Its Contact Info action saves values that were typed into the conversation, so a field that holds a typed phone number or a stated acreage works, and a field meant to hold a one-line summary of the call comes back empty. That is not documented anywhere obvious, and the handoff had been designed around a composed summary field, so it looked like the agent was failing to fill it in. The handoff had to be redesigned around values the agent captures verbatim, with anything composed written through the workflow rather than by the agent. The other one was silence. A real seller pauses to think, and an agent that treats two seconds of quiet as a finished answer talks over people. Tuning the endpointing so it waits through a thinking pause but still ends the call when someone has hung up took more passes than the prompt did.",
    result:
      "All three live on a real number. Calls are answered around the clock, qualified records land in GoHighLevel without anyone typing them, and the demo dashboard on this site shows live calls, transcripts and conversion metrics from the same system.",
  },
  {
    key: "Google Ads MCP Server",
    kicker: "Own product · Open source",
    client: "My own, published open source",
    platform: "Any MCP client (Claude, ChatGPT)",
    role: "Design and build",
    stack: "Python, MCP, Google Ads API",
    summary:
      "An open-source MCP server that lets Claude or ChatGPT query and manage a Google Ads account natively, in conversation, instead of through an export.",
    challenge: [
      "Asking a model about ad performance meant exporting a CSV, pasting it in, and getting an answer about a snapshot that was already stale. Anything the model suggested then had to be typed back into the Ads interface by hand.",
      "The Google Ads API does not meet a model halfway. Queries go in as GAQL, results come back as deeply nested objects, and a single report can be thousands of rows. Handing that to a model raw burns the context window and produces confident answers about the wrong field.",
    ],
    built: [
      "An MCP server exposing a small set of tools over the Google Ads API. Each one takes the arguments a person would actually ask about, builds the GAQL itself, and returns flat labelled rows rather than the API's nested shape.",
      "Published open source so anyone can point their own MCP client at their own account, rather than being a connector only I can run.",
    ],
    features: [
      { name: "Campaign and keyword reporting", body: "Spend, clicks, conversions and cost per conversion over any date range, without writing GAQL." },
      { name: "Flat rows, not nested objects", body: "Results come back shaped for reading, so the model answers about the field you meant." },
      { name: "Search terms", body: "What people actually typed, which is where the wasted spend hides." },
      { name: "Account structure", body: "Campaigns, ad groups and their status, so the model knows what it is looking at before it reports on it." },
      { name: "Date ranges in plain words", body: "Last 30 days, last month, this quarter, resolved server side." },
      { name: "Open source", body: "Anyone can read it, run it against their own account, or extend it." },
    ],
    hardPart:
      "The first version had a tool for everything the API could do, and it made the model worse. Given twenty overlapping tools it would pick a plausible wrong one, or chain three where one would have done, and every wrong pick cost a round trip. Cutting the surface down to a handful of tools that each answer a question someone actually asks, and pushing the GAQL generation inside them, fixed more than any prompt change did. The other constraint was volume. A keyword report across a real account will not fit in a context window, so the server aggregates and truncates before returning, and says in the response that it did, because a model handed a silently truncated list will happily tell you that is the whole account.",
    result:
      "Published and usable against any Google Ads account through an MCP client. The same design feeds the GA4 server and the conversational Ads agents built on top of it.",
  },
  {
    key: "Pipedrive to Google Ads",
    kicker: "Client project · Attribution",
    client: "A B2B agency client",
    platform: "n8n workflow",
    role: "Design and build",
    stack: "n8n, Pipedrive API, Google Ads offline conversions",
    summary:
      "An n8n workflow that maps Pipedrive deal stages to Google Ads offline conversion events, so the ad platform optimises on deals closed rather than forms filled.",
    challenge: [
      "Google Ads was optimising for form fills, because that is the last thing it could see. It had no idea which of those forms became a qualified deal and which were time wasters, so it kept buying more of whatever produced the most forms.",
      "The information existed. It was in Pipedrive, where deals move through stages and some of them close. It just never travelled back to the platform that paid for the click.",
    ],
    built: [
      "A workflow that watches Pipedrive for stage changes and uploads a matching offline conversion to Google Ads, keyed on the click ID captured when the lead first landed.",
      "Each stage maps to its own conversion action with its own value, so Google can tell the difference between a lead that qualified and one that actually closed, and bid accordingly.",
    ],
    features: [
      { name: "Stage changes become conversions", body: "Qualified, proposal and won each upload as their own conversion action." },
      { name: "Values, not just counts", body: "Deal value goes up with the conversion, so bidding optimises on revenue rather than volume." },
      { name: "Click ID carried through", body: "The GCLID is captured at the form and stored on the deal, which is what makes the match possible." },
      { name: "Runs on a schedule", body: "Batched uploads rather than one call per change, well inside the API's limits." },
      { name: "Failures are visible", body: "Unmatched uploads are logged rather than silently dropped." },
      { name: "No change to how sales works", body: "The team moves deals in Pipedrive the way it always did." },
    ],
    hardPart:
      "The click ID has to survive a journey nobody designed it for. It arrives as a URL parameter on the landing page, has to be captured into a hidden form field, carried through the form handler into Pipedrive, and still be sitting on the deal weeks later when it finally closes. It gets lost at every one of those steps: a landing page that strips parameters, a form that does not pass hidden fields, a deal created manually by a rep who rang the lead back. Then there is the window. Google will not accept an offline conversion more than 90 days after the click, and a B2B deal can easily take longer than that, so the long cycle deals are invisible by definition. The workflow uploads at the earlier stages too, partly for that reason: a qualification event inside the window is worth more to the bidding than a closed deal that arrives too late to count.",
    result:
      "Running on a schedule. Google Ads now optimises on deal stages instead of form fills, and the gap between cost per lead and cost per deal is finally visible.",
  },
  {
    key: "Copy Chief AI",
    kicker: "Client project · AI evaluation",
    client: "A direct response marketing team",
    platform: "Web",
    role: "Rubric design and build",
    stack: "Next.js, Claude API, Supabase",
    scale: "7 scoring criteria",
    summary:
      "An evaluator that scores marketing copy against a seven-criterion rubric and says why, so feedback stops depending on who read it that day.",
    challenge: [
      "Copy review was a bottleneck and a lottery. One reviewer cared about the hook, another about the offer, and a writer could get opposite notes on the same draft depending on who was free.",
      "Pointing a model at it and asking if the copy is good does not work. It agrees with whatever it is shown, scores everything around seven out of ten, and gives notes that could apply to any piece of writing.",
    ],
    built: [
      "Seven named criteria, each scored separately, each with its own definition of what a high and a low score looks like. The model scores one criterion at a time rather than forming an overall impression and justifying it afterwards.",
      "Every score comes back with the specific line it is about, so a writer gets a pointer to the sentence rather than a paragraph of general advice.",
    ],
    features: [
      { name: "Seven criteria, scored apart", body: "Hook, clarity, offer and the rest are judged individually, so a strong hook cannot carry a weak offer." },
      { name: "Reasons tied to lines", body: "Each score quotes the copy it is judging, not the piece in general." },
      { name: "Anchored scales", body: "Each criterion defines what a 2 and a 9 look like, which is what stops everything landing on 7." },
      { name: "Consistent across reviewers", body: "The same draft gets the same read regardless of who submits it." },
      { name: "Fast enough to use mid-draft", body: "Writers run it while writing instead of waiting for a review slot." },
      { name: "Rubric is editable", body: "The team owns the criteria and can tune them as what works changes." },
    ],
    hardPart:
      "Getting a model to actually use the bottom of a scale. Asked to score copy out of ten, it clusters everything between six and eight, because a model that has been trained to be agreeable treats a low score as rudeness. Averaged across seven criteria that produces a number that never moves and tells nobody anything. Two things fixed it. Each criterion got written anchors describing what a 2 looks like and what a 9 looks like in concrete terms, so the score is a classification against examples rather than a judgement call. And the criteria are scored in separate passes, because when they are scored together the model forms an overall opinion first and then back-fills the individual scores to agree with it, which is the exact failure the rubric was built to prevent.",
    result:
      "In use by the team. Copy gets the same read every time, writers can self-check before submitting, and the rubric itself is something the team can argue about and change, which is the part that makes it stick.",
  },
];

export const caseStudyFor = (title: string) => CASE_STUDIES.find((c) => c.key === title);
