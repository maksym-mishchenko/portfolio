---
name: Markdown Humanizer
description: Transforms markdown files by removing AI writing patterns and adding human voice. Use when editing portfolio files, documentation, blog posts, or any markdown content to make it sound more natural and authentic. Detects and fixes: inflated importance language, promotional tone, superficial analysis, em dash overuse, rule of three patterns, AI vocabulary, negative parallelisms, excessive conjunctive phrases, bolded lists, and uniform sentence structure.
---

# Markdown Humanizer

Remove signs of AI-generated writing from markdown files to create authentic, human-sounding content.

## When to Use

- Portfolio markdown files that sound too polished or generic
- Technical documentation that feels robotic
- Blog posts or articles lacking personality
- README files with promotional language
- Any markdown content flagged as "AI-sounding"

## What Gets Fixed

This skill identifies and removes common AI writing patterns based on Wikipedia's comprehensive guide on AI writing detection.

### 1. Inflated Importance & Symbolism

**Problem**: AI exaggerates significance by connecting topics to broader themes using predictable phrases.

**Watch for**:
- stands/serves as a testament to
- is a vital/significant/crucial/pivotal/key role/moment
- underscores/highlights its importance/significance
- reflects broader trends/movements
- symbolizing its ongoing/enduring/lasting impact
- contributing to the evolution/advancement of
- setting the stage for
- marking/shaping the future
- represents/marks a shift/turning point
- evolving landscape
- focal point
- indelible mark
- deeply rooted in

### 2. Promotional & Admiring Language

**Watch for**:
- clean and modern, sleek design
- vibrant, dynamic, thriving, bustling
- testament to innovation
- cutting-edge, state-of-the-art
- seamless, intuitive experience

### 3. Superficial "-ing" Analysis

**Watch for**:
- ...emphasizing the significance of
- ...reflecting the continued relevance of
- ...highlighting the importance of
- ...underscoring the need for
- ...showcasing the potential of
- ...demonstrating the value of

### 4. Em Dash Overuse

**Fix**: Replace most em dashes (—) with commas, parentheses, colons, or periods. One em dash per paragraph maximum.

### 5. Rule of Three

**Fix**: Vary list length (2, 4, or 5 items), break parallel structure, or eliminate the list.

### 6. AI Vocabulary & Clichés

**Common culprits**:
- It's important to note that / It's worth noting that
- In today's digital landscape/world
- In the realm/world of
- Dive deep into / Delve into
- Unlock the power/potential of
- Leverage (as a verb)
- Robust, comprehensive, holistic
- Game-changer, paradigm shift
- Best practices

### 7. Negative Parallelism ("It's not X, it's Y")

**Fix**: Just state what it is directly.

### 8. Excessive Conjunctive Adverbs

**Watch for overuse**: Moreover, Furthermore, Additionally, However, Nevertheless, Therefore, Thus, Consequently, Notably, Significantly

**Fix**: Use these sparingly (one per every 3-4 paragraphs).

### 9. Bolded List Titles

**Problem**: AI creates bulleted lists where each item starts with a bolded phrase followed by a colon.

**Fix**: Convert to prose or use meaningful bullets without the bold+colon pattern.

### 10. Uniform Sentence Structure

**Fix**: Vary sentence length dramatically. Mix short punchy statements with longer explanatory ones.

## Adding Human Voice

Removing AI patterns isn't enough. Good writing needs personality.

### Have Opinions
Don't just report facts—react to them. Share what you actually think.

### Add Specific Details
Replace generic statements with concrete examples. Numbers, dates, specifics.

### Use Messy Structure
Real thinking isn't linear. Show your thought process, dead ends included.

### Vary Sentence Length
Short sentences hit hard. Longer sentences provide context and build toward a point. Mix them.

### Admit Uncertainty
Humans don't know everything. "I think", "seems like", "not sure yet" are fine.

### Show Failed Attempts
Real projects involve mistakes. First attempt failed? Say so.

## Processing Workflow

1. **Read the entire file** to understand context and purpose
2. **Identify AI patterns** from the lists above
3. **Make targeted edits** — remove/replace each pattern
4. **Add human elements** — opinions, specifics, uncertainty, failures
5. **Preserve meaning** — never change factual content
6. **Maintain markdown formatting** — keep headers, code blocks, links intact

## Testing Your Work

Ask yourself:
- Would a human actually write this sentence this way?
- Does this sound like something I'd say to a colleague?
- Are there specific details or just generic statements?
- Can I feel a person behind these words?
- Would I want to keep reading this?

If the answer to any of these is "no," keep editing.
