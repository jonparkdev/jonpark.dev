---
topic: hellointerview/delivery-framework
stage: seedling
---

- The context behind CAP theorem is the following:
	- You have 3 properties Consistency, Availability and Partitioning. In your system you can only pick 2 of these properties for you system at one time
- When reading any guide to system design,  the assumption is Partitioning is a given. Most of the time the interviewer is testing you on a problem of scale which requires your system to be distributed. So given the business requirements do you chose availability or consistency. A contrived example of each would be:
	- Consistency: a booking system where its critical that 2 people cannot book the same reservation (i.e. ticket). We would want to prioritize that every person engaging with the system interacts with the same live data.  If two people some how manage to be going for the same ticket at once then w
	- Availability: No matter what access to the system but be 
- Non functional requirements go hand in hand with CAP theorem. Example: "the system must prioritize data consistency" like in our booking example.
- I initially struggled with applying this concept because these explanations I kept reading lacked framing. I felt CAP as an acronum hid a lot of information. It felt like every explanation of CAP provided some example cases like banking, social media, ride share app and just chose one base your answer off of some common systems you can think of. The explanation was lacking the fundamental intuition.
- Okay what is that intutition, to develop I like to think about frame it this way:
	- What does partitioning mean?
		- Partitioning is not specific enough when just looking at CAP. Ofcourse it means your system is distributed. And one could naturally think of techniques like sharding, or even read replicas because  your distributing full copies of your data across multiple databases. But here in is what lies the confusion for me. Partitioning is strictly referencing this question. What happens when nodes fail and are cut off from your system in the network sense? Could be a database or service. What do you priotize?
		- This idea of failure modes connected many concepts together for me and it stems from the idea that PACELC. 
	- At it's core the question is about **data**. And how your system handles it as clients interact with it.