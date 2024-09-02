// Describes what question indices is good to be different (according to Rufus), if you choose that you want a complimentary co-founder

export const differenceIndices = [
    17,
    28,
    30,
    31,
]

export function processSimilarityScores(similarityScores: number[], complementary: boolean) {
    if (complementary) {
        const adjustedScores = similarityScores.map((score, index) =>
            differenceIndices.includes(index) ? 1 - score : score
        );
        return adjustedScores.reduce((sum, score) => sum + score, 0) / adjustedScores.length;
    }
    return similarityScores.reduce((sum, score) => sum + score, 0) / similarityScores.length;
}

const questions = [
    {
        "answer": "Be my own boss. Build something big, something I'm proud of and earn money",
        "question": "Why do you want to start a company — in general, and in particular right now?"
    },
    {
        "answer": "Happy users. Solving a problem. Earning money.",
        "question": "What is success to you? What motivates you personally?"
    },
    {
        "answer": "Success > Control",
        "question": "Is control or success more important? (i.e. Are you willing to step aside if the company is more likely to have a financially successful outcome or is it important for the founders to stay in control of the company’s destiny?)"
    },
    {
        "answer": "I have a GF",
        "question": "Is there anything your co-founders should know that may materially affect your time or legal status as a founder? (e.g. visa, green card, criminal record)"
    },
    {
        "answer": "Yes. But if we fail to get traction, I am not afraid to pivot. Other time commitments = GF",
        "question": "Will this company be your primary activity? Do you have any other time commitments? If so, how much time will you spend on external committments, and for how long will you do so?"
    },
    {
        "answer": "Very high right now and coming years. At 30 (i.e. in 5 years) I hope to have built a successful company. Still high time commitment, but more family time after that.",
        "question": "What is your expected time commitment right now? How do you see that changing in the next 6 months? 2 years? 5 years?"
    },
    {
        "answer": "Happy to work late into the night, prefer no early mornings. I work weekends. On weekends I prefer as little scheduled work as possible and more free work when it suits you.",
        "question": "What times of the day would you prefer to work (Ie. start 7am or 10am; not work past 6pm, etc...)? How do you feel about working on weekends?"
    },
    {
        "answer": "Good=50, Great=60, Hell=80+. Probably work harder in the beginning, but we will see. Will likely continue working hard.",
        "question": "How many hrs are you prepared to put in on weekly basis building our company? What sounds good? What sounds like hell? Do you have different expectations for different phases of the company’s lifespan? (i.e. willing to work harder in the beginning)"
    },
    {
        "answer": "Stockholm, Sweden. But if needed happy to do Singapore, Dubai, London or whatever. But not some other random Nordic city.",
        "question": "Where should your startup be based? Where do you incorporate it?"
    },
    {
        "answer": "No BS, Only A players and driven",
        "question": "What are 3 words to describe the team culture you want to create (e.g. open, hard-working, eccentric)?"
    },
    {
        "answer": "Prefer physical office, OK for people to work remote but still meet quite regularly. Own responsibility to get shit done but absolute MUST to show up to client and investor meetings.",
        "question": "How do you feel about remote or distributed teams? If you have a physical office, how much would you want to work from home?"
    },
    {
        "answer": "Hmm... Employees? Depends how effecient they are. They have to be very productive, but OK for them to distribute that time as they see fit. But if they don't live up to expectations they have to grind.",
        "question": "How much would you expect your employees to work?"
    },
    {
        "answer": "Discuss, challenge, be frank / NO BS and graciously accept if you are wrong / always learning",
        "question": "What processes or techniques would you use to get the most out of your team? For example, how would you help them become better managers or achieve their goals?"
    },
    {
        "answer": "OK with pure professional but must be fun / laughing together.",
        "question": "How much of your time do you hope to spend either working or socializing with coworkers? How close or distant would you keep the relationship (ie. Purely professional? Should you all be best friends?) "
    },
    {
        "answer": "Not important. Best people with best skills and ideas, only thing that matters. Maybe try to get a gender balance when hiring for productivity purposes (boys clubs often devolve into madness IMO)",
        "question": "How important is diversity & inclusion? Concretely, how would you put that into action?"
    },
    {
        "answer": "Need to level up your game. Sometimes wake up in the night but generally pretty OK",
        "question": "How do you react to extreme external pressure?"
    },
    {
        "answer": "Yes. I want cliff / vesting clauses. But if you are not putting in the work you should want to quit on your own",
        "question": "Can one co-founder fire another co-founder? Can someone else fire a founder?"
    },
    {
        "answer": "Nature and GF",
        "question": "What do you need to re-charge?"
    },
    {
        "answer": "Argue your point. Best point wins. Stalemate: the one that is most passionate decides. If approx. equally passionate. The one that is doing the most valuable work for the company decides.",
        "question": "How would you resolve personal conflict between co-founders? How about stalemates?"
    },
    {
        "answer": "The one who is most committed will stay. The one that's doing the work.",
        "question": "In case this becomes part of your partnership’s evolution, how would you go about handling a startup divorce? Who would leave and who would stay with the company?"
    },
    {
        "answer": "Talk to users. Only thing that matters. Why don't they love the freaking product?",
        "question": "What happens in the scenario where you aren’t growing? How would you diagnose the problem? How have each of your capabilities and approach contributed to growth failures in your pasts?"
    },
    {
        "answer": "If 2 founders: the one that is most passionate about it will decide. When possible use data. Everyone should want the best for the company. But generally, should probably be ONE person in charge.",
        "question": "How will decisions be made? Are our voices equally valubale, or can someone outvote the other?"
    },
    {
        "answer": "IRL and all the time. E.g. after pitches, investor meetings, client meetings, product sprints etc....",
        "question": "How do you think we should give feedback to each other (frequency, channel)?"
    },
    {
        "answer": "Must be absolutely essential, otherwise we pay him or her with money / stock options. Not on the cofounder team.",
        "question": "How would you think about bringing on a third (or N+1) cofounder?"
    },
    {
        "answer": "Equal for cofounders. But minimize the number of cofounders. Must be essential. Otherwise give some equity incentives to all employees, feels better for everyone",
        "question": "How should founder equity be set? What’s your philosophy on an employee equity pool?"
    },
    {
        "answer": "Depends on the idea. But as little as possible to realize the ambition.",
        "question": "What is your approach to fundraising? How much will you raise? (i.e. “zero” to “as much as we can”) In the range of “bootstrapped small business” to “go big or go home” -- where do you want this startup to go?"
    },
    {
        "answer": "IPO and continue as shareholder",
        "question": "What does an ideal company exit look like to you? (i.e. “work on company for 1-2 years and sell for 7 figures” to “work for 10 + years, reach 9 figures in revenue, and IPO”)"
    },
    {
        "answer": "Long path for ultimate success, but short path for customer validation / revenue ",
        "question": "How do you think about the timeframe and pace of success? Are you willing to take the longer path? How long is too long?"
    },
    {
        "answer": "Sell entire position would need SEK 1bn+ valuation. For divesting part of stake could be a little earlier. If a little stake is sold, I could sit on the company forever / wait for a long time before final exit",
        "question": "What number would you sell at? How would that change if you got extra liquidity from your existing positions?"
    },
    {
        "answer": "Not terribly important. Most important is what the ultimate stake is worth.",
        "question": "How much dilution are you prepared to have along the way?"
    },
    {
        "answer": "I have a long runway without salary. Maybe 2 years. But I would need customer validation / revenue to actually commit super hard to the venture.",
        "question": "What is your personal runway? How long can you continue building with your current burn rate? Would you invest your own money in the business (ideally retaining higher equity in return)?"
    },
    {
        "answer": "Survive: SEK 10k / month, Comfortable: SEK 50k / month, Made-it: SEK 0k/month - no need for salary if equity worth is growing rapidly and dividends are paid",
        "question": "What is the minimum monthly salary you need to survive? To be comfortable? To feel like you’ve “made it?”"
    }
]