import json, uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

IST = timedelta(hours=5, minutes=30)
now = datetime.now(timezone.utc)
ist_str = (now + IST).strftime("%Y-%m-%d %H:%M:%S IST")
iso_str = now.strftime("%Y-%m-%dT%H:%M:%S.000Z")
OUTPUT_DIR = Path(__file__).resolve().parent / "outputs"

# ── Emotion colors ────────────────────────────────────────────────────────────
EMO = {
    "warmth":  "#ffe08a",
    "tension": "#ffadad",
    "relief":  "#9bf6ff",
    "hope":    "#caffbf",
    "romance": "#ffc6ff",
    "mystery": "#d7d2ff",
}

# ── Characters (shared across all three files) ────────────────────────────────
CHARACTERS = [
    {"id": str(uuid.uuid4()), "name": "Arjun Rao",  "gender": "MALE",   "screenTime": "LONG",
     "desire": "To see justice served to everyone, without exception.",
     "fear":   "Nothing. That is the most dangerous thing about him.",
     "lie":    "Killing the powerful will make the world better. He cannot see that people replace people.",
     "shade":  "Gray"},
    {"id": str(uuid.uuid4()), "name": "Aditya",     "gender": "MALE",   "screenTime": "LONG",
     "desire": "To disappear. Mountains. A lowkey life. Gone.",
     "fear":   "His mother died on his lap on a public street. No one stopped. Twenty minutes. That verdict — people don't stop for each other — is the wound.",
     "lie":    "Everyone is selfish, including his father. He doesn't know yet that his father built an empire to outrun grief, not to abandon his son.",
     "shade":  "Gray"},
    {"id": str(uuid.uuid4()), "name": "Sara",       "gender": "FEMALE", "screenTime": "LONG",
     "desire": "Her family's belief. Not money. Not fame. Just her parents looking at her the way parents look at a child they trust.",
     "fear":   "She gave her trust to someone at 18. He used it and left. Her family's look changed permanently. She lives with that look every day.",
     "lie":    "No man loves unconditionally. Every man wants something before he gives anything. That's why she challenges instead of begs.",
     "shade":  "Gray"},
    {"id": str(uuid.uuid4()), "name": "Surya",      "gender": "MALE",   "screenTime": "LONG",
     "desire": "To escape the rat race — and pull everyone he loves up with him.",
     "fear":   "Being stuck. Not failure — stagnation. The window closing without him noticing.",
     "lie":    "Loyalty always pays off. This belief has been exploited by everyone who ever recognised it in him. Aditya is the first person who exchanges instead of takes.",
     "shade":  "Gray"},
]

# ── Layout helper: simple grid ────────────────────────────────────────────────
def pos(i, cols=4, xgap=380, ygap=280, x0=0, y0=0):
    return x0 + (i % cols) * xgap, y0 + (i // cols) * ygap

# ── Card builder ──────────────────────────────────────────────────────────────
def card(n, title, scene_slug, emotion, screenplay_text, i):
    x, y = pos(i)
    return {
        "id": str(uuid.uuid4()),
        "title": f"{n} {scene_slug}",
        "scene": f"{n} {scene_slug}",
        "color": EMO[emotion],
        "x": float(x),
        "y": float(y),
        "screenplay": screenplay_text,
    }

# ══════════════════════════════════════════════════════════════════════════════
# ACT ONE CARDS
# ══════════════════════════════════════════════════════════════════════════════
act1_cards_raw = [

(1,"INT. PRESS CONFERENCE HALL — DAY","mystery",
"""CAM: EXTREME CLOSE UP — STATIC. CAMERA MOVES IN SLOWLY.

BLACK.

A phone screen. Locked. Face-up on an empty chair. Dark.

HOLD.

The phone RINGS. No vibration. Just screen light. A name half-visible — the camera is not interested in it.

A HAND enters frame from the right. Unhurried. Presses the power button.

Call rejected.

The hand withdraws. Screen stays lit — wallpaper.

THANOS. Still. Purple. Looking at nothing.

HOLD ON THIS. Two seconds past comfortable.

Camera pulls back. Slow. Deliberate.

The phone is on a chair. The chair is in a row. The row is full of journalists — notebooks, recorders, phones. Every journalist leans slightly forward. Toward the stage. Toward the powerful man at the podium.

Every journalist except one.

ARJUN RAO. Seated. Upright. Not leaning. Not recording. Pen in hand — but still. The only person in the frame who looks like he has already heard everything the man at the podium is about to say.

SOUND COMES UP SLOWLY. We are in the room now.

                                        CUT TO:
"""),

(2,"INT. PRESS CONFERENCE HALL — CONTINUOUS","tension",
"""CAM: Wide two-shot. Stage vs Arjun. Never cross the axis.

SANJAY OBEROI at the podium. Performing confidence — weight on both palms, voice above conversational, pausing in the right places.

Around Arjun — journalists performing engagement. Pens moving. Heads nodding at the right beats.

Arjun's pen: still.

He watches Oberoi the way you watch a machine run a cycle you already understand.

Q&A announced. Safe questions. Expected questions. The questions that make the room feel like journalism without requiring any.

Arjun's hand — not yet. He is still watching.

                                        CUT TO:
"""),

(3,"INT. PRESS CONFERENCE HALL — CONTINUOUS (Q&A)","tension",
"""CAM: Hold on Oberoi's face during the question. Let the smile form before it arrives. Cut to Arjun — already done with the moment.

Two journalists ask safe questions. Oberoi answers. The room exhales appropriately.

Arjun raises his hand. Oberoi nods.

Arjun stands. No preamble.

                    ARJUN
               (flat, exact — not aggressive)
          The infrastructure allocation for the eastern corridor —
          the tender was awarded six weeks before the public notice
          was filed. That's not a procedural error. That's a sequence.
          Who decided the sequence?

The room — a temperature drop.

Oberoi's face: a smile forming before he can stop it. The smile of a man filing a name.

                    OBEROI
               (controlled, warm)
          That's a very specific question. We'll have our
          communications team follow up with you after the session.

Arjun sits. Already writing. He doesn't wait for the answer. He already knew there wasn't one.

                                        CUT TO:
"""),

(4,"INT. PRESS CONFERENCE HALL — LATER","tension",
"""CAM: Find the aide's eyes finding Arjun's back. Connect both looks without dialogue.

Conference wrapping. Controlled chaos of packing up.

VIKRAM — Oberoi's aide — moves through the room efficiently.

Oberoi leans slightly toward him. Says something we don't hear.

Vikram looks across the room.

Arjun's back — disappearing through the door.

Vikram nods.

Oberoi continues his exit. Warmth restored for the cameras.

                                        CUT TO:
"""),

(5,"EXT. PRESS CONFERENCE BUILDING — NIGHT","mystery",
"""CAM: Track Arjun from behind — the only time we follow him this way. City as indifferent system. Teal. Functional.

Journalists spill out. Network. Laugh. Perform collegiality.

Arjun moves through them the way water moves through a crowd — without friction, without connection.

He turns a corner. The building disappears from frame.

Just him. And the street. And the teal.

                                        CUT TO:
"""),

(6,"EXT. METRO STREET — NIGHT","tension",
"""CAM: WIDE STATIC. One streetlight. Entire scene in one unbroken frame. No cuts. No slow motion. No music. Camera does not move toward the violence.

Empty street. One figure — Arjun, walking.

THREE MEN step out from the side of frame. Not dramatically. They were just standing there. Now they're not.

Arjun stops. Doesn't back up. Doesn't reach for anything. Reads the situation completely, quickly, without expression.

                    FIRST MAN
          You ask too many questions.

Arjun looks at him. Then at the other two. Back to the first.

                    ARJUN
          Sit down. Talk to me.

Flat. Not a threat. A genuine offer. The most unsettling response they expected.

The three men exchange a look. A laugh — nervous underneath.

                    FIRST MAN
               (stepping forward)
          Talk.

He SHOVES Arjun.

Arjun absorbs it. His face — the door to something, opening.

                    ARJUN
               (quiet — a warning they won't hear as one)
          Once more.

First Man shoves again. Harder.

THE WIDE STATIC FRAME HOLDS.

Arjun moves.

Not technique. Not performance. A man whose body has made a decision his mind is no longer consulted about.

FIRST MAN — goes down hard.
SECOND MAN — moves in. Gets further than he should. Lands something.
The response to being hit is not proportional.
SECOND MAN — down. Stays down.
THIRD MAN — doesn't move. Smart enough.

Arjun stands over the two on the ground. Breathing slightly harder. That is the only evidence.

                    ARJUN
          Help them.

He adjusts his collar. Picks up his bag. Walks away.

HOLD — the two men on the ground. The third man frozen. Arjun's back disappearing from the frame's edge.

No music. The street. Exactly as it was. Except it isn't.

HOLD.

                                        CUT TO BLACK.

— TITLE CARD:   C O R R E C T —

                                        FADE IN:

[ DIRECTOR'S NOTE: Arjun Rao does not appear on screen again for approximately 30 minutes. He exists only as a name, a published story, a topic of careful conversation. The audience is left with the street. The collar adjustment. The walk away. ]
"""),

(7,"INT. ADITYA'S GARAGE — EARLY MORNING","warmth",
"""CAM: Stay close on his face while driving. The one moment in the film where he is completely himself.

Before the city wakes. ADITYA alone with his cars.

Not showing them. Not driving them. Just — with them. The way someone is with a thing they love without needing it to love them back.

BMW M4 Competition. Others behind it. This is the cheapest one.

He drives out. Alone. Empty roads. Pre-dawn. No destination. No performance.

Just — moving.

                                        CUT TO:
"""),

(8,"INT. ADITYA'S FITNESS STUDIO — EARLY MORNING","warmth",
"""CAM: Establish his physicality without underlining it. Wide. Arjun exists only as text on someone else's screen — unacknowledged.

The space before people arrive. ADITYA alone — preparing equipment. Clean, functional room. No mirrors positioned for vanity.

A man comfortable in his own silence.

Two or three STUDENTS arrive. He teaches — patient, exact, no performance. Corrects a form without commentary.

A STUDENT thanks him warmly.

                    ADITYA
               (already moving on)
          Same time Thursday.

A phone on the bench — Arjun's published story on the screen. Headline visible. No one mentions it.

Aditya clocks it. Half a second. Continues.

                                        CUT TO:
"""),

(9,"INT. ADITYA'S OFFICE — DAY","mystery",
"""CAM: Find the moment comfortable outcome replaces just outcome. Don't linger. File it.

Two PEOPLE mid-argument when Aditya enters. They stop. His presence alone lowers the temperature.

He listens to both sides. Mediates. Gives the correct process — but quietly steers the outcome toward stability over justice. Everyone leaves satisfied.

He sits alone. Pours a drink. Looks at it. Doesn't drink it. Sets it down. Leaves the room.

The drink stays on the desk.

                                        CUT TO:
"""),

(10,"INT. ADITYA'S HOME — NIGHT","mystery",
"""CAM: Wide. Show how much space one person has learned to inhabit alone. The house as managed silence.

He enters alone. Food. Screen. Couch. The motions of a life that functions.

He picks up his phone. Opens Arjun's published story. Reads. Sets the phone down — screen up. Story still showing.

He looks at the ceiling. Stays there.

                                        CUT TO:
"""),

(11,"INT. FUNERAL HOME — DAY [FLASHBACK — 25 YEARS EARLIER]","tension",
"""CAM: Memory palette — same teal, fractionally warmer. Not nostalgia. Memory. Hold on the boy's face. Not the funeral. The boy watching the father.

SMASH CUT from Aditya at the ceiling — to YOUNG ADITYA, age 11. Same stillness. Different face.

Aditya's MOTHER — being mourned.

ADITYA'S FATHER — standing straight at the front. Receiving condolences efficiently. Grief calibrated perfectly for the room.

The father does not look at the boy during the scene.

Young Aditya watches his father perform the correct emotion. Understands something. Cannot name it. Will spend twenty-five years living by it anyway.

                                        CUT TO:
"""),

(12,"INT. ADITYA'S HOME — NIGHT [PRESENT]","mystery",
"""Aditya. Same face. Older. He turns off the light.

The same glass between him and everything.

                                        CUT TO:
"""),

(13,"INT. SARA'S WORKSPACE — DAY","hope",
"""CAM: Her energy pulls the frame. Reframe fractionally faster here than any other scene. The two-second pause — a full stop in music.

SARA enters already talking — earpiece, mid-sentence to someone not in the room. Drops bag. Pulls up screens. All one motion. The room reorganizes around her arrival.

She finds Arjun's story in a feed. Stops moving.

Two full seconds. First pause we've seen from her.

She reads. Folds the printed article deliberately. Puts it in her bag. Continues.

                                        CUT TO:
"""),

(14,"INT. PITCH ROOM — DAY [SARA'S PITCH HISTORY]","tension",
"""CAM: Same framing for all three pitches. The rooms change. Her posture doesn't.

THREE PITCHES. THREE NO'S. Not dramatic rejections — the quiet kind. Polite. Reasoned. Final.

Each time — she absorbs it. Doesn't collapse. Doesn't perform resilience. Recalibrates. Walks out. Continues.

Third room — she leaves and stands outside the building.

Her face: not defeat. The face of a person who knows exactly why she was rejected — and it had nothing to do with the idea.

                                        CUT TO:
"""),

(15,"INT./EXT. VARUN METRO — VARIOUS — DAY","mystery",
"""CAM: Documentary register. No editorializing. Three locations. Three shots. Triptych. End on an empty space.

RAMACHANDRAN in his space — dispensing, receiving. The economy of respect running smoothly.

CUT TO — DEVRAJ PILLAI. The town points to him. Uses him as evidence of their own goodness. He receives it with warmth. Years of practice.

CUT TO — Aditya. Holding something steady. The quiet authority of a man the room organizes itself around.

WIDE — the town's load-bearing structure. Triptych.

Camera finds an empty space in the frame. Where someone isn't.

HOLD on the absence.

                                        CUT TO:
"""),

(16,"INT. RAMACHANDRAN'S SPACE — DAY","mystery",
"""CAM: Resist making him a villain. Find the self-serving decision the way you'd find a hairline crack in concrete — right angle only.

Ramachandran advising someone. Genuinely. Wisely. A man who has done this long enough that wisdom and habit are the same thing.

Alone briefly. A small decision — benefits himself, dressed in the language of community good.

He believes it. That is the most important detail. He genuinely believes it.

                                        CUT TO:
"""),

(17,"INT. PUBLIC SPACE — DAY / SAME SPACE — LATER","mystery",
"""CAM: The transition between public and private in one continuous shot if possible. The room empties and he becomes someone else without moving.

Town pointing to DEVRAJ PILLAI. Using him as proof. He receives with warmth. Performance so practiced it's almost real.

Room empties. The performance drops. Not a villain revealed — a person revealed. Tired. Real.

He looks at something — an object, a message — that connects to the story he's been living inside. Doesn't collapse. Just looks. Then puts it away. Continues.

                                        CUT TO:
"""),

(18,"INT. A PUB — NIGHT [SURYA ENTERS]","warmth",
"""CAM: Two-shot. Equal framing. Neither man given advantage. The BMW M4 visible behind them through the window.

Aditya alone at the bar.

SURYA walks in. Sees the M4 Competition through the window first. Then finds the owner. Walks up. Uninvited. Sits down.

                    SURYA
          That yours?

                    ADITYA
          Yes.

                    SURYA
          How many you have?

Aditya looks at him. The look he gives everything. Complete. Cool. Measuring.

                    SURYA (CONT'D)
          I have friends. Good people. None of them are into money.
          I want to be your friend so one day I can own a BMW.
          Not yours. Mine.

Silence.

                    ADITYA
          Why would I be friends with a stranger?

                    SURYA
          Because I have skills you can't get through normal people.
          Use them. We figure out the rest as we go.

Aditya looks at him for a long time.

This is the most honest thing anyone has said to him in years.

                    ADITYA
          What kind of skills?

That's the yes. Neither names it. Both know.

                                        CUT TO:
"""),

(19,"INT. ADITYA'S OFFICE — DAY [FIRST MEETING WITH SARA]","tension",
"""CAM: Two-shot. Equal framing. Always. The folder between them on the desk — unopened — the whole scene.

Sara arrives. No small talk. Clean pitch. Capital. Numbers. She slides the folder.

He doesn't look at it. Looks at her. The glass way.

                    ADITYA
          Why should I?

She was prepared for negotiation. Not indifference. She recalibrates. Then —

                    SARA
          Because you've been sitting in your father's money your
          entire life calling it your own life. Investing in this
          is the first actual risk you'd ever take with your own
          judgment. Not his capital. Yours.

The room.

He doesn't react the way men react when challenged. No anger. No performance.

                    ADITYA
          Come back when you've earned my trust. Tell me how you
          plan to do that.

She blinks. Expected rejection or acceptance. Got neither.

She leaves. He watches her go. Not the way men watch women — the way someone watches a problem they didn't expect to find interesting.

                                        CUT TO:
"""),

(20,"INT. ADITYA'S OFFICE — DAY [SURYA'S FIRST JOB]","hope",
"""CAM: Stay on Aditya while Surya explains. The face of a man recalibrating someone's value.

Aditya gives Surya something small. Not obviously a test — both know it's a test.

Surya does it. Better than expected. No celebration. Sends the result.

Aditya calls him. One question.

                    ADITYA
          How did you do this?

Surya explains. Aditya listens differently — the way you listen when someone shows you something your money cannot simply buy.

Something that might be respect arriving. For the first time.

                                        CUT TO:
"""),

(21,"INT. COMMUNITY HALL — DAY [RITUAL — SETUP]","warmth",
"""CAM: Show the structure of it. Who holds what. What it costs to be inside it.

Preparation. Aditya coordinating without directing. Sara participating — efficiently, genuinely.

Everyone in their role. The system in full performance mode.

Aditya and Sara — one moment of eye contact. The shorthand of two people who have met once and are still figuring out what that means.

Then — an entrance at the far edge of the frame.

The audience recognizes the posture before the face.

                                        CUT TO:
"""),

(22,"INT. COMMUNITY HALL — CONTINUOUS [THE RETURN]","tension",
"""CAM: Wide — the sea of performing townspeople. Camera slowly finds him. Static. Still. Everything moves. He doesn't. Hold three seconds past comfort. The audience has been waiting 30 minutes.

The ritual in full motion. Everyone performing their version of collective goodness.

Camera moves through the crowd. Looking for something.

Finds him.

ARJUN RAO.

Present. Standing still while everyone moves around him. Hands at sides. Face neutral. Not contemptuous. Not performing neutrality. Just — not participating in something he considers a transaction.

HOLD. Three seconds past comfortable.

Sara sees him from across the room. She is the only one who doesn't look away from what she sees.

She reads his stillness correctly — not rudeness, a position. A man who has decided something and lives inside that decision completely.

She recognizes that quality. She has it too.

                                        CUT TO:
"""),

(23,"INT. COMMUNITY HALL — LATER [POST-RITUAL]","tension",
"""CAM: Slow pan — Still Man to Witness to Debater. No cuts. One continuous movement connecting all three. The audience reads the triangle in real time. End on the Elder's face.

Post-ritual warmth. Smaller groups. Ramachandran holding court.

Arjun nearby — not part of the group, not removed from it. Present the way an observer is present.

A TOWN PERSON turns to him.

                    TOWN PERSON
          He's done so much for this town, hasn't he?

The room waits. The standard affirmation expected.

Arjun looks at the Elder. Then back.

                    ARJUN
               (flat — a weather report)
          The Hariyali trust grant — 2019. Sixty percent of the
          allocation went to a vendor with a family connection to him.
          The remaining forty percent reached the community.
          That's what people remember.

The room absorbs it in silence. Not explosion. Absorption. A system processing an unwanted input.

Arjun is already looking elsewhere. Conversation over for him.

Camera — slow pan —

Finds ADITYA at the back of the frame.

One frame — his face shows it. He knew. Has known. Then closes.

Pan continues — finds SARA. She looks at Aditya. He doesn't meet her eyes.

Ramachandran's face — controlled. Something filed. Dangerous.

                                        SMASH CUT TO BLACK.

— END OF ACT ONE —

                                        FADE OUT.
"""),
]

# ══════════════════════════════════════════════════════════════════════════════
# ACT TWO CARDS
# ══════════════════════════════════════════════════════════════════════════════
act2_cards_raw = [

(1,"INT. COMMUNITY HALL — NIGHT [POST-ELDER SCENE]","mystery",
"""CAM: Find the geometry of a space that doesn't know where to put what just happened. Hold the empty space after the Elder leaves.

People packing up. Conversations slightly too deliberate. The normal noise of departure with one frequency missing.

The Elder — alone for a moment. Looks at the space Arjun occupied. Takes out his phone. Makes a call. We hear nothing.

He walks out of frame — still talking.

The empty space where Arjun stood — held in frame after he leaves.

                                        CUT TO:
"""),

(2,"INT. RAMACHANDRAN'S PRIVATE SPACE — NIGHT","tension",
"""CAM: Wide two-shots. Good lighting. These are not villains in shadows. Practical people making a practical decision in good light. That is more frightening.

The Elder with two TRUSTED PEOPLE. Not a meeting — a conversation.

                    RAMACHANDRAN
          Find out what he wants.

A pause.

                    RAMACHANDRAN (CONT'D)
          If he doesn't want anything —

He doesn't finish. The other two understand.

Not malice. Practicality. That's the point.

                                        CUT TO:
"""),

(3,"EXT./INT. NEUTRAL SPACE — DAY [SARA APPROACHES ARJUN]","mystery",
"""CAM: Equal two-shot. Neither character given visual advantage. Two people playing the same game with different rule sets.

Sara finds Arjun. Not accidentally.

                    SARA
          I want to talk to you.

He looks at her. Full attention. No warmth. No coldness. Complete reception.

                    ARJUN
          Okay.

They find somewhere to sit. She has her argument ready. He has nothing prepared. He doesn't need to prepare for conversations. He just arrives in them.

                                        CUT TO:
"""),

(4,"INT. NEUTRAL SPACE — CONTINUOUS [FIRST ARGUMENT]","tension",
"""CAM: Slow push in on her face — almost imperceptible. By the time she stands, the frame is tighter than when she sat down. She doesn't notice.

Her argument — social cohesion, collective ritual, community function. Prepared. Sharp. Real. He listens without moving.

She finishes. Long silence.

                    ARJUN
          Every act of kindness you perform in public is a transaction.
          You are not kind. You are investing.

She counters immediately. Sharp. The counter she had prepared for exactly this.

He listens to the counter with the same completeness.

Then — silence. Not searching. A man who heard something that didn't change anything.

                    SARA
               (controlled composure)
          This was useful.

She walks away — straight back, controlled pace, the posture of someone who won.

Camera stays on Arjun. He opens his notebook. Already on to the next thing.

                                        CUT TO:
"""),

(5,"INT. NEUTRAL SPACE — DAY [ADITYA HEARS]","mystery",
"""CAM: Stay on Aditya during her retelling. The face of a man who already knows the answer to a question someone else is still forming.

Sara tells Aditya about the conversation. Casually. Analytically. An interesting problem she encountered.

                    ADITYA
          Be careful.

                    SARA
          Of what? He's just a man with a philosophy.

                    ADITYA
          Yes.

He doesn't finish the thought. She doesn't hear the weight in the yes. The audience does.

                                        CUT TO:
"""),

(6,"INT. SURYA'S WORKSPACE — DAY","warmth",
"""CAM: The contrast between the calls. Same Surya. Different energy. The audience reads the difference before Surya can.

Several people calling in favors Surya agreed to. Skills deployed for friends who will not return them. He does it all. Without resentment. Genuinely.

Then — Aditya calls. Different conversation.

Surya's posture changes. Not because Aditya is richer. Because Aditya is the only one who exchanges.

                                        CUT TO:
"""),

(7,"INT. ARJUN'S APARTMENT — NIGHT","mystery",
"""CAM: Wide. Respectful of distance. The notebook — the only object the camera finds twice. Don't reach for its contents.

He enters. No ritual of arrival. Just continues. The apartment as extension of himself. Functional. Minimal. No decorative warmth.

He opens the notebook. Sits. Writes. Camera stays across the room. We see him writing. We don't see what.

He closes it. Sits still.

                                        CUT TO:
"""),

(8,"INT. EDITORIAL OFFICE — DAY","tension",
"""CAM: The phone call we don't hear is the scene's center. Shoot the editor's face during it — a man letting someone else make his decision for him.

SURESH THOMAS reads Arjun's latest piece. Longer pause. Reaches for the phone. Conversation we don't hear. Hangs up.

                    SURESH
          I can't run this one.

Arjun looks at him. One beat. Takes the piece back. Walks out. No argument. No anger. Door closed — not slammed.

Suresh sits alone with what he just did.

                                        CUT TO:
"""),

(9,"EXT. PUBLIC SPACE — DAY [SECOND ATTACK]","tension",
"""CAM: WIDE STATIC. Daylight. No cuts during the violence. No music. No slow motion. Daylight makes it clinical. No shadows to hide in.

A public space. Daytime. THREE MEN — positioned. Not accidental. Someone sent them.

Arjun moving through. Sees them. Stops.

The attack is more organised than the first. More brazen — daylight, public. The machinery getting less careful.

THE WIDE STATIC FRAME HOLDS.

Same result. Same pattern. Further than needed. In daylight. In public.

He walks away. People watching. He doesn't look at them.

                                        CUT TO:
"""),

(10,"INT. ADITYA'S HOME — EVENING [THE JACKET]","mystery",
"""CAM: The jacket he doesn't remove — find it in the wide shot. Don't underline it. The audience will feel it.

He enters. Sits without removing his jacket. Body language of a man not settled inside his own space tonight.

He pours a drink.

Drinks it.

First time in the film.

Sits with the glass.

                                        CUT TO:
"""),

(11,"INT. ADITYA'S SPACE — DAY [SARA HEARS ABOUT ATTACK]","tension",
"""CAM: Two-shot throughout. She is usually the one generating energy. Here — still. Register the stillness in her.

Aditya tells her. She listens differently — not building a counter, just receiving.

                    SARA
          He was attacked first.

                    ADITYA
          Yes.

                    SARA
          So he defended himself.

                    ADITYA
          Further than needed.

                    SARA
          How much further?

He tells her. Silence. She doesn't have a clean argument. The absence of argument — louder than argument.

                                        CUT TO:
"""),

(12,"INT. NEUTRAL SPACE — DAY [THIRD ARGUMENT — THE LINE]","tension",
"""CAM: Slow push in — perceptible this time. By the end the frame is tight enough the audience feels the compression with her. Hold on her first stillness.

Third time here. The space has become their space.

She sits. No prepared argument today. A genuine question.

                    SARA
          Why do you do this? The journalism. The questions.
          If you know how people are — why keep trying?

                    ARJUN
          I don't try to correct anyone. I just refuse to pretend
          they're correct when they're not.

                    SARA
          I don't believe in systems or governments.
          I believe in the people running them.

He looks at her. Long pause.

                    ARJUN
          What happens when the people you believe in
          don't believe in themselves?

She has no answer. Not because she's slow — because the answer requires Aditya. And she's not ready to go there.

Camera push — perceptible now. Her face filling slightly more frame.

For the first time — she goes still.

The frame notices.

                                        CUT TO:
"""),

(13,"INT. SARA'S WORKSPACE — NIGHT [QUESTION FOLLOWS HER]","mystery",
"""CAM: Her stillness in the space defined by forward motion — a stopped clock. Wrong. Noticeable.

She enters. Doesn't start working immediately — first time in the film. Sits first.

Looks at her project. At everything she built.

Her phone. Aditya's name. She picks it up. Puts it down. Doesn't call.

Opens her laptop. Types one line. We don't see what. Closes it. Sits in the dark.

                                        CUT TO:
"""),

(14,"INT. ADITYA'S SPACE — EVENING [ADITYA AND SURYA — THE MOTHER STORY]","warmth",
"""CAM: WIDE. Stay wide. Don't push in on either face. The restraint is the scene's power.

Working. Comfortable silence. The silence of two people who no longer need to fill space.

Something triggers it. An ambulance passing outside. A sound. Anything ordinary.

Aditya doesn't react visibly.

Then — quietly. Without turning around.

                    ADITYA
          My mother died on the street. Heart attack.
          I was eleven. She fell on my lap. I kept calling
          her name for twenty minutes. People walked around us.

Beat.

                    ADITYA (CONT'D)
          Twenty minutes. Not one person stopped.

FLASHBACK — SMASH CUT:

A street. Day. A woman on the ground. A boy's hands. Her face. People's legs walking past — only legs. No faces. Moving. Continuing. The street's sound. Nothing else.

BACK TO PRESENT. Same silence. Surya doesn't move. Doesn't say sorry.

                    SURYA
          Is that why you don't care about people?

                    ADITYA
          Is that why you think I don't care about people.

Not a question. Not a correction. Something in between.

The conversation moves on. Or ends. Nothing more is said about it.

                                        CUT TO:
"""),

(15,"INT. FAMILY OFFICE — EVENING [ADITYA'S FATHER — THE TRUTH]","mystery",
"""CAM: Find the father's stillness — thirty seconds at most — and hold it. This is the most honest thing this man has ever shown.

Aditya stays late. Alone in the office.

He finds something — not dramatically. A calendar. A note. An anniversary marked in his father's handwriting. His mother's name. Every year. Marked. Private.

His father enters. Doesn't see him. Goes to his desk. Sits.

For the first time — Aditya watches his father when his father doesn't know he's being watched.

The man who is always moving — is completely still. Just for a moment.

Then the phone rings. He answers. Motion restored. He notices Aditya.

Neither acknowledges what just happened.

                                        CUT TO:
"""),

(16,"INT. COMMUNITY GATHERING — DAY [THE SYMBOL EXPOSED]","tension",
"""CAM: Slow pan — Arjun to Aditya to Sara. No cuts. One continuous movement. The audience reads the triangle in real time.

A gathering. Enough ears.

A TOWN PERSON asks Arjun directly about Devraj Pillai. The question expects affirmation.

                    ARJUN
               (flat — a fact, not an attack)
          He was not from Dharavi. He was not self-made. The family
          he described losing — the timeline doesn't hold. What he
          built is real. What he claimed to build it from isn't.

THE ROOM — stillness. The system receiving a corrupted input.

Camera — slow pan — finds ADITYA at the back of frame.

One frame — he knew. Has known. Then closes.

Pan continues — finds SARA. She looks at Aditya. He doesn't meet her eyes.

                                        CUT TO:
"""),

(17,"INT. SARA'S SPACE — DAY [FIRST FRACTURE]","tension",
"""CAM: They start in their usual equal two-shot. By the end — slightly more space between them in the frame. Not dramatic. Measurable.

                    SARA
          You knew.

Not a question.

                    ADITYA
          Yes.

                    SARA
          How long?

He tells her.

Silence. Not anger. The process of a person updating their understanding of someone they trusted.

She leaves differently than she arrived.

Camera stays on Aditya. The glass around him — showing its first real crack.

                                        CUT TO:
"""),

(18,"EXT./INT. VARUN METRO — EVENING [THIRD ATTACK — NOTEBOOK SHIFT]","tension",
"""CAM: The stop and turn back — hold it. The notebook in close up for the first time. The pen moving. Not the words. The action of writing is enough.

More attackers this time. Positioned deliberately. Professional enough to be concerning. Not professional enough to succeed.

WIDE STATIC. Same result. He walks away.

But this time — he stops. Turns back. Looks at them.

Not anger. Calculation.

He takes out his notebook. Writes something. We don't see what. Puts it away. Continues.

That notebook moment — something has shifted.

                                        CUT TO:
"""),

(19,"INT. A ROOM — DAY [ADITYA IS ASKED PUBLICLY]","tension",
"""CAM: The one second of hesitation is the scene's entire purpose. Find it. Hold it. Let the audience feel its weight before the careful thing closes it. Reveal Sara late — camera pull back.

The Elder addresses Aditya. People present.

                    RAMACHANDRAN
          Say something. The town needs to hear something from you.

Aditya.

One second.

The audience sees what's in that second — the true thing almost arriving.

Then —

                    ADITYA
               (the careful thing)
          He's someone with strong opinions and a particular way
          of expressing them. That doesn't make him right or wrong.
          It makes him difficult. And difficult isn't dangerous.

Camera pulls back — wider than expected.

REVEALS: SARA in the room. She was there the whole time. We didn't see her.

Her face as Aditya speaks his careful words — doesn't change. That is worse than if it did.

                                        CUT TO:
"""),

(20,"INT. SURYA'S WORKSPACE — DAY [SURYA TRACKS ARJUN]","hope",
"""CAM: Surya working. Aditya arriving. The folder already on the table.

Aditya doesn't ask. Surya is already three steps ahead.

Digital patterns. Movements. He's been building a picture of Arjun since the second attack. Not because Aditya told him. Because Surya understood where this was going before Aditya admitted it.

He has a folder ready the moment Aditya walks through the door.

                    ADITYA
          How long have you been doing this?

                    SURYA
          Since you stopped sleeping properly.

                                        CUT TO:
"""),

(21,"INT. ARJUN'S APARTMENT — NIGHT [THE LIST BEGINS]","mystery",
"""CAM: Mirror of the opening image — phone, rejection, Thanos — but inverted. Opening: he didn't look. Here: he does. The difference in that one look is the whole film's turning point.

A new day. Desk cleared. No journalism. Just the notebook.

He opens to a new page. Writes.

Phone rings. He rejects it.

Thanos wallpaper.

This time — he looks at it. One beat.

Sets it face-down.

                                        CUT TO:
"""),

(22,"INT. ADITYA'S SPACE — EVENING [ARJUN VISITS ADITYA]","mystery",
"""CAM: Two chess players with no pieces on the board yet. Just recognition.

Arjun arrives. No announcement. Aditya opens the door.

                    ADITYA
          Come in.

Brief exchange. Both men understanding exactly what is happening inside the other. Neither performing that understanding.

Arjun leaves.

Aditya watches him go from the doorway. Knows what's coming.

The door closes. He stands on his side of the closed door. The choice — not made yet. But forming.

                                        CUT TO:
"""),

(23,"INT. ARJUN'S APARTMENT — DAY [ADITYA FINDS THE NOTEBOOK]","tension",
"""CAM: His own name. Hold longer than any face shot in the film so far.

The apartment. Aditya moving through it carefully. Finds the notebook. Opens it.

His face — moving through the names. Computing.

Then — his father's name.

PAUSE.

Not fear. Something more complicated. The face of a man who spent his whole life believing his father didn't deserve his care — finding out that the only person who agrees with him put his father on a list.

He closes the notebook. Puts it back. Exactly where it was.

Stands in Arjun's apartment — the most honest space in the film.

The lie he has believed his whole life — everyone is selfish — meets its counter: a man who worked every day to forget a woman because forgetting her was the only way to keep living.

That's not selfish. That's grief.

                                        SMASH CUT TO BLACK.

— END OF ACT TWO —

                                        FADE OUT.
"""),
]

# ══════════════════════════════════════════════════════════════════════════════
# ACT THREE CARDS
# ══════════════════════════════════════════════════════════════════════════════
act3_cards_raw = [

(1,"INT. ARJUN'S APARTMENT — MORNING [THE LIST — FIRST NAME]","mystery",
"""CAM: The notebook angle — enough to confirm, not enough to show. Audience should feel they saw more than they did.

The desk cleared of journalism. Just the notebook.

He wakes. Morning routine — unchanged on the surface.

He opens the notebook. Sits. Writes methodically.

Camera — across the room. Wide. We see his hand moving. We see the notebook open at an angle — just enough to confirm what we already knew.

He closes it. Stands. Looks at the window.

The reflection in the glass — him, looking at the city, looking back at him. Same shot as before. The direction has changed. He isn't observing anymore.

                                        CUT TO:
"""),

(2,"INT./EXT. VARUN METRO — DAY [FIRST TARGET — AFTERMATH]","tension",
"""CAM: The Elder's fear — new information on a face we've only seen controlled. Hold it one beat longer than he'd want.

A space where something happened. Evidence of disruption — clinical, deliberate. Not rage. Correction.

Town people processing. The language shifting — not 'who would do this' but 'we should have moved faster.'

The Elder receives the news. His face — for the first time — fear beneath the control.

He is on a list he doesn't know about. But he feels it.

                                        CUT TO:
"""),

(3,"INT./EXT. VARUN METRO — VARIOUS [THE TOWN REALIZES]","tension",
"""CAM: Shoot the gap between what the town says and what it means. Show both.

                    TOWN PERSON 1
          We should have —

                    TOWN PERSON 2
          If we had just —

                    TOWN PERSON 3
          This is what happens when you ignore —

The language of people rewriting the sequence of events to put themselves on the right side of it.

The Elder — in a room of afraid people. He is the least afraid. Because he already knew this was coming.

He calls Aditya.

                                        CUT TO:
"""),

(4,"INT./EXT. VARUN METRO — DAY [ADITYA TRACKS HIM]","hope",
"""CAM: Show Aditya in motion — unusual. He's been behind the frame the entire film. Now moving forward. Register it as both right and wrong simultaneously.

Aditya receives the Elder's call. Listens. Says nothing meaningful. Hangs up. Sits. Then — stands. Starts moving.

Using his position — his network, his access — as investigation tools.

He has a picture now. His face — the face of a man who has spent the whole film computing and has arrived at a number he doesn't like.

                                        CUT TO:
"""),

(5,"INT. NEUTRAL SPACE — DAY [FRACTURE — FINAL]","tension",
"""CAM: The question she actually asked — 'because he's wrong?' — should land on the audience the same way it lands on Aditya. Hold on his face after she leaves.

Sara comes to him. She already knows what he's doing.

                    SARA
          You're trying to stop him.

                    ADITYA
          Yes.

                    SARA
          Because he's wrong?

Pause.

                    ADITYA
          Because killing is wrong.

                    SARA
          That's not what I asked.

He has no answer to what she actually asked.

She looks at him one last time. Full reception.

She leaves. He sits with the empty space she just left.

                                        CUT TO:
"""),

(6,"INT./EXT. VARUN METRO — DAY [SECOND TARGET]","tension",
"""CAM: Resist the urge to make this triumphant. He's not celebrating. He's working. The horror is in that continuity.

Another name. Another aftermath. Town more shaken.

Real power starting to activate its own mechanisms.

The Still Man — alone. Notebook open. Second name marked — we see the gesture, not the word.

He looks at the remaining names. The two at the top — the ceiling. And one other.

His face — unchanged. He closes the notebook.

                                        CUT TO:
"""),

(7,"INT./EXT. VARUN METRO — DAY [SARA CONFRONTS ARJUN]","tension",
"""CAM: When he says 'You're the only person who makes me think twice' — stay on her face. Not his.

She doesn't plead. Sara doesn't plead. She presents facts.

                    SARA
          I worked with them for eight months. Aditya's father
          funded my startup when no one else would. He's not clean.
          But he's not what you've decided. There's a difference.

                    ARJUN
          Between what?

                    SARA
          Between corrupt and evil. You stopped making that
          distinction three names ago.

One frame — something shifts in Arjun. Then closes.

                    ARJUN
          That's not a defence. That's the system defending
          itself through you.

She has no answer. Not because he's wrong. Because she doesn't know if he's right.

                    ARJUN (CONT'D)
          You're the only person who makes me think twice.

Beat.

                    ARJUN (CONT'D)
          I've thought twice. I'm continuing.

He leaves.

                                        CUT TO:
"""),

(8,"EXT. OBEROI GROUP HEADQUARTERS — DAY [THE CEILING]","mystery",
"""CAM: WIDE. Him small in frame. The building enormous. Not to diminish him — to show the actual scale of the wall a common man runs into. No score. No slow motion.

He got close. The machinery of real power closed around him.

He stands outside the building he cannot enter.

WIDE SHOT. Him small. The building — architectural authority.

He looks at the building. A long time.

Not anger. Not defeat. Calibration.

He opens his notebook. The two top names — still there. Unreachable.

He turns the page.

The other name. Reachable.

He looks at it.

Closes the notebook.

HOLD ON HIS FACE.

The audience understands what was just decided.

                                        CUT TO:
"""),

(9,"INT. ADITYA'S FITNESS STUDIO — NIGHT [ADITYA AND SURYA — THE PLAN]","warmth",
"""CAM: The folder on the table between them. Surya's face — not triumphant. Just present.

Aditya finally tells Surya what he's doing.

Surya slides a folder across. Everything Aditya needs. Already done. Two weeks of work.

                    ADITYA
          How long have you been doing this?

                    SURYA
          I know.

That's all.

This is the merger. Two names of the same light. One complete person who can finally act.

The man who wanted to disappear — cannot disappear now. Because someone is standing next to him who actually sees him.

                                        CUT TO:
"""),

(10,"INT. ADITYA'S FITNESS STUDIO — NIGHT [ADITYA PREPARES]","hope",
"""CAM: His eyes. The body is the same as every training session. The purpose is different. Find that difference in his eyes. Not his technique.

He trains. Differently.

Not the body — the decision inside the body. What he is willing to do. What he is not.

His line — stop, not destroy.

He stops. Stands in the center. Breathing.

Looks at his hands.

The hands of a man who drew a line and is preparing to hold it.

                                        CUT TO:
"""),

(11,"INT. ARJUN'S APARTMENT — NIGHT [STILL MAN — LAST NIGHT]","mystery",
"""CAM: Stay wide. The apartment as a completed thing — a man who organized his life into this space and has stepped outside it. Camera stays after he's gone.

He enters. Sits. Opens the notebook. The pen — in his hand.

Camera — wide. Stays wide.

He closes it. Sits still.

The city outside. Teal. Indifferent. His reflection in the glass.

His phone — incoming call. A name on the screen.

He doesn't reject it. Doesn't answer. Watches it ring. Stops.

Sets it face-down. Stands. Leaves the apartment.

The camera stays. Holds on the empty space he just occupied.

The space holds what he was.

                                        CUT TO:
"""),

(12,"EXT./INT. VARUN METRO — NIGHT [THE CONFRONTATION]","tension",
"""CAM: WIDE STATIC. Keep both men in the same frame as long as physically possible. No close-up during the exchange. The four lines happen in the same wide shot as the fight. Equal. Unresolved. Camera does not take a side.

One location. Not dramatic — functional. Metro city. Night. Teal. Concrete. No audience.

They occupy the same space.

No buildup. No circling. Both men know why they're here.

                    ARJUN
          You agree with me.

                    ADITYA
          Yes.

                    ARJUN
          Then why.

                    ADITYA
          Because you don't get to decide who lives.

                    ARJUN
          Someone has to.

                    ADITYA
          No. They don't.

They continue.

THE WIDE STATIC FRAME HOLDS.

No cuts. No slow motion. No music.

Arjun — economical. Exact. No performance. Fights the way he does everything — correctly. To finish.

Aditya — trained for this specifically. Not to defeat — to hold. Every response stops force, doesn't answer it.

The fight is their argument made physical. Two men. Same understanding of the world. One difference. That difference — expressed in how each one moves.

Aditya holds his line.

Arjun — stopped. Controlled. Contained.

Not by the town. Not by power. By one man who drew one line and held it.

Arjun looks at Aditya.

Not anger. Not betrayal.

Recognition.

                    ARJUN
          You finally did something.

Pause.

                    ARJUN (CONT'D)
          Just not the thing that mattered.

He says nothing more.

                                        CUT TO:
"""),

(13,"EXT./INT. SAME LOCATION — CONTINUOUS [AFTERMATH]","relief",
"""CAM: Arjun's last look at Aditya is the scene. Everything else is logistics. Hold the look. Then hold Aditya alone after.

Aditya — standing over Arjun. Both breathing.

Footsteps approaching from outside frame. Authority. The system.

Arjun is taken. No resistance. No explanation.

He looks at Aditya once more.

Not accusation. Not forgiveness.

I see you completely.

He's taken from frame.

Aditya stands alone in the space.

HOLD.

                                        CUT TO:
"""),

(14,"INT. NEUTRAL SPACE — DAY [SARA'S QUESTION]","mystery",
"""CAM: Three steps with her — then stop. The camera choosing to stay with him. He is the one who has to live inside what he did. She gets to walk out of frame. He doesn't.

She finds him after.

He looks like a man who did what he decided. And is sitting inside the weight of that.

She looks at him.

                    SARA
          Was it the right thing?

Silence.

He has no answer. Not because he doesn't know — because the honest answer and the survivable answer are the same answer. Yes. And no. In exactly the same proportion.

She doesn't wait. She already knew.

She leaves.

Camera follows her three steps — then stops.

Stays on Aditya. Alone in the frame.

The most alone he has been in the entire film.

Before — his aloneness was chosen. Managed.

Now it is arrived.

                                        CUT TO:
"""),

(15,"INT. FAMILY HOME — DAY [ADITYA AND HIS FATHER]","warmth",
"""CAM: Wide. Both men in frame. The silence between them — the most honest thing this family has ever shared.

After everything. Aditya goes to his father.

Not to explain. Not to apologize. Not to announce a new relationship.

He just — goes. Sits with him.

The father doesn't ask questions.

Two men in the same room. Grieving the same woman. In the same language. For the first time — in the same room at the same time.

No dialogue needed. No resolution.

Just — presence. The thing his father never gave him. He gives it back.

                                        CUT TO:
"""),

(16,"INT./EXT. VARUN METRO — VARIOUS [THE TOWN RECOVERS]","relief",
"""CAM: Find the empty space where Arjun used to stand. Don't point at it. The audience will find it. They've been trained to find him in the frame.

The system closes around the absence Arjun left. Fills it. Continues.

Ramachandran — control restored. Tighter than before.

Devraj Pillai — still in position. Slightly smaller. The town still pointing. But the pointing has a different quality. Like insisting.

Camera — wide. The system operational.

One empty space in the frame. Where someone used to stand still.

Nobody looks at it.

                                        CUT TO:
"""),

(17,"INT. ADITYA'S OFFICE [THE FINAL IMAGE]","mystery",
"""CAM: Slow push in — almost imperceptible. Continues past comfortable. His face filling the frame. Ten seconds of black. No music.

Aditya — his space. His position. Everything intact. Everything exactly as it was.

A TOWN PERSON comes to him with a problem.

He listens. He mediates. Correctly. Protects the comfortable outcome.

He is very good at this. He has always been very good at this.

The town person leaves satisfied.

Aditya alone.

He pours a drink. Looks at it. Sets it down. Doesn't drink it.

Everything back in its place.

Sara passes through frame. Background. Moving. Her energy — forward motion. But different. The same motion. Different destination.

She doesn't stop. Doesn't look at him.

He watches her.

Surya appears briefly in the frame. Catches Aditya's eye. Small nod. Continues.

Camera — slow push in. Almost imperceptible.

His face.

The last image:

A man who got exactly what he chose.

Not what he wanted.

What he chose.

Those are not the same thing.

He already knew that. He knew it before Arjun arrived.

Arjun just made it impossible to unknow.

The push continues. Past comfortable.

His face filling the frame —

The boy at the street.
The man at the drink.
The same face.
The same glass between him and everything.

                                        SMASH CUT TO BLACK.

HOLD ON BLACK.

Ten seconds.

No music.

No title card.

Just — black.

And the audience sitting inside what they know about themselves.

                                        FADE OUT.

— THE END —
"""),
]

# ══════════════════════════════════════════════════════════════════════════════
# BUILD DRAFTIT FILES
# ══════════════════════════════════════════════════════════════════════════════
def build_character_tree(characters, relationships):
    nodes = []
    for index, character in enumerate(characters):
        nodes.append({
            "id": character["id"],
            "characterId": character["id"],
            "name": character["name"],
            "x": float((index % 4) * 260),
            "y": float((index // 4) * 180),
        })

    by_name = {character["name"]: character["id"] for character in characters}
    links = []
    for relationship in relationships:
        source = by_name.get(relationship["from"])
        target = by_name.get(relationship["to"])
        if not source or not target:
            continue
        links.append({
            "id": relationship["id"],
            "source": source,
            "target": target,
            "label": relationship["label"],
        })

    return {"nodes": nodes, "links": links}

def build_draftit(title, cards_raw, output_path):
    cards = []
    for i, (n, slug, emotion, screenplay) in enumerate(cards_raw):
        cards.append(card(n, f"{n} {slug}", slug, emotion, screenplay, i))
    
    # Fix titles — remove duplicate number prefix
    for i, (n, slug, emotion, screenplay) in enumerate(cards_raw):
        cards[i]["title"] = f"{n} {slug}"
        cards[i]["scene"] = f"{n} {slug}"

    relationships = [
        {"id": str(uuid.uuid4()), "from": "Aditya",   "to": "Surya",    "label": "Friendship — Harvey and Mike"},
        {"id": str(uuid.uuid4()), "from": "Aditya",   "to": "Arjun Rao","label": "Ideological enemy"},
        {"id": str(uuid.uuid4()), "from": "Aditya",   "to": "Sara",     "label": "Challenges worldview"},
        {"id": str(uuid.uuid4()), "from": "Sara",     "to": "Arjun Rao","label": "Understands him — only one"},
    ]

    project = {
        "id": str(uuid.uuid4()),
        "title": title,
        "author": "Surya",
        "cards": cards,
        "cardLinks": [],
        "characters": CHARACTERS,
        "characterTree": build_character_tree(CHARACTERS, relationships),
        "screenplay": "",
        "createdAt": iso_str,
    }

    data = {
        "app": "Draft It",
        "format": "draftit",
        "scope": "project",
        "version": 2,
        "exportedAt": iso_str,
        "exportedAtIst": ist_str,
        "timezone": "Asia/Kolkata",
        "project": project,
    }

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ {output_path}  ({len(cards)} cards)")

if __name__ == "__main__":
    build_draftit("ACT ONE — The World Before Pressure", act1_cards_raw, OUTPUT_DIR / "CORRECT_Act1.draftit")
    build_draftit("ACT TWO — The Compression", act2_cards_raw, OUTPUT_DIR / "CORRECT_Act2.draftit")
    build_draftit("ACT THREE — The Reckoning", act3_cards_raw, OUTPUT_DIR / "CORRECT_Act3.draftit")
