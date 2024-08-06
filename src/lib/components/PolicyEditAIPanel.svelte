<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Button from './ui/button/button.svelte';

	export let cases;
	export let policyDescription;
	export let policyId;

	let messageHistory: any[] =
		cases.size > 0
			? [
					{
						person: 'AI Assistant',
						message: `I am an AI assistant who can help brainstorm policy edits to address policy flaws identified in related cases where the policy is misaligned with people's votes. To begin with, please select a related case below.`
					}
				]
			: [
					{
						person: 'AI Assistant',
						message: `I am an AI assistant who can help brainstorm policy edits to address policy flaws identified in related cases where the policy is misaligned with people's votes. It appears that this policy currently has no related cases. Please first add some related cases that reveal the policy's flaws so I can help refine the policy accordingly.`
					}
				];

	let loading = false;
	let showCaseSelector = cases.size > 0 ? true : false;
	let selectedCaseId: string;
	let selectedCaseLabel: string;
	let selectedCaseReasons: any[] = [];
	let selectedCaseReason: string;
	let showMisalignSelector = false;
	let showLinktoEditCase = false;
	let showUnsureSelector = false;
	let showReasonSelector = false;
	let showReasonMunualInput = false;
	let manualInputValue = '';
	let showInstructionInput = false;
	let iterateInstruction = '';
	let suggestedPolicy = '';
	let showRestartBtn = false;

	let aiLogsDocId = '';

	const resetButtonAndData = () => {
		showRestartBtn = false;

		// reset buttons
		selectedCaseId = '';
		selectedCaseLabel = '';
		selectedCaseReasons = [];
		selectedCaseReason = '';
		showMisalignSelector = false;
		showLinktoEditCase = false;
		showUnsureSelector = false;
		showReasonSelector = false;
		showReasonMunualInput = false;
		manualInputValue = '';
		showInstructionInput = false;
		iterateInstruction = '';
		suggestedPolicy = '';

		showCaseSelector = cases.size > 0 ? true : false;
	};

	const updateMessageHistory = async (person: string, message: string) => {
		messageHistory = [...messageHistory, { person, message }];
		if (aiLogsDocId == '') {
			const res = await fetch(`/api/assistant/ailogs`, {
				method: 'POST',
				body: JSON.stringify({
					action: 'policyEditAI',
					messageHistory: messageHistory,
					entity: 'policies',
					entityId: policyId
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			aiLogsDocId = data.id;
		} else {
			await fetch(`/api/assistant/ailogs`, {
				method: 'PATCH',
				body: JSON.stringify({
					aiLogsDocId,
					person,
					message
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	};

	const generatePolicy = async () => {
		const prompt =
			`You are a helpful assistant focusing on supporting users' revision of the following policy: ` +
			policyDescription +
			` In a few sentences, slightly revise the policy without significant changes so that the policy ` +
			selectedCaseLabel + // allow or disallow
			` the following scenario: ` +
			cases.get(selectedCaseId).description +
			` Here is the reason why the policy should ` +
			selectedCaseLabel +
			` the scenario: ` +
			selectedCaseReason;

		const res = await fetch('/api/assistant/policy', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt
			})
		});

		if (res.ok) {
			const data = await res.json();
			suggestedPolicy = data.text;
			await updateMessageHistory(
				'AI Assistant',
				`Here is the suggested policy edit that is better aligned with the case you selected and the reason you provided:`
			);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`You may use the suggested content to edit the policy. Alternatively, you may provide instructions on how you would like to iterate on the suggested content or restart the conversation.`
			);
			showInstructionInput = true;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please restart and try again.'
			);
		}
	};

	const iteratePolicy = async () => {
		let prompt =
			`You are a helpful assistant focusing on supporting users in editing the following course policy: ` +
			suggestedPolicy +
			` In a few sentences, slightly revise the policy without significant changes based on the following instructions: ` +
			iterateInstruction;
		const res = await fetch('/api/assistant/policy', {
			method: 'POST',
			body: JSON.stringify({
				prompt: prompt
			})
		});
		if (res.ok) {
			const data = await res.json();
			suggestedPolicy = data.text;
			await updateMessageHistory('AI Assistant', `Here is the revised policy:`);
			await updateMessageHistory('AI Assistant', data.text);
			await updateMessageHistory(
				'AI Assistant',
				`You may use the suggested content to edit the policy. Alternatively, you may provide instructions on how you would like to iterate on the suggested content or restart the conversation.`
			);
			showInstructionInput = true;
		} else {
			await updateMessageHistory(
				'AI Assistant',
				'Sorry, something went wrong. Please restart and try again.'
			);
		}
		iterateInstruction = '';
	};
</script>

<h3 class="font-semibold mt-2 my-2">Brainstorm with AI</h3>
<ScrollArea class="h-[85vh] w-full rounded-md border">
	<div class="text-sm mx-3">
		{#each messageHistory as message}
			<p class="font-bold py-2">{message.person}</p>
			<p class=" rounded p-2 mb-2 {message.person == 'You' ? 'bg-sky-100' : 'bg-gray-100'}">
				{message.message}
			</p>
		{/each}

		<div hidden={!loading}>
			<p class="font-bold py-2">AI Assistant</p>
			<Skeleton class="w-full h-16" />
		</div>
	</div>
	<div class="flex flex-col space-y-2 my-2">
		{#if showCaseSelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						showCaseSelector = false;
						loading = true;
						selectedCaseId = v?.value;
						await updateMessageHistory('You', v?.label);
						await updateMessageHistory(
							'AI Assistant',
							`How is the current policy misaligned with people's votes on this case?`
						);
						showMisalignSelector = true;
						loading = false;
						showRestartBtn = true;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select a related case" />
					</Select.Trigger>
					<Select.Content>
						{#each [...cases] as [caseId, c], i}
							<Select.Item value={caseId} label={c.title} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
		{#if showMisalignSelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						showMisalignSelector = false;
						loading = true;
						await updateMessageHistory('You', v?.label);
						if (v?.value == 'allow' || v?.value == 'disallow') {
							selectedCaseLabel = v?.value;
							if (cases.get(selectedCaseId).reasons.length !== 0) {
								selectedCaseReasons = cases
									.get(selectedCaseId)
									.reasons.filter((c) => c.label == selectedCaseLabel);
								if (selectedCaseReasons.length !== 0) {
									await updateMessageHistory(
										'AI Assistant',
										`Why should this case be ` +
											selectedCaseLabel +
											`ed? Please select a reason that others have submitted for this case, or briefly explain your own reason. You may click on the related case on this page to view the details of each reason.`
									);
									showReasonSelector = true;
								} else {
									await updateMessageHistory(
										'AI Assistant',
										`Why should this case be ` +
											selectedCaseLabel +
											`ed? Please briefly explain the reason.`
									);
									showReasonMunualInput = true;
								}
							} else {
								await updateMessageHistory(
									'AI Assistant',
									`Why should this case be ` +
										selectedCaseLabel +
										`ed? Please briefly explain the reason.`
								);
								showReasonMunualInput = true;
							}
						} else if (v?.value == 'unsure') {
							await updateMessageHistory(
								'AI Assistant',
								'Should this case be allowed or disallowed, or are most people unsure?'
							);
							showUnsureSelector = true;
						} else if (v?.value == 'unrelated') {
							await updateMessageHistory(
								'AI Assistant',
								'Please click the link below to visit the edit case page, where you may remove the case from the policy.'
							);
							showLinktoEditCase = true;
						}
						loading = false;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select a misalignment condition" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item
							value="disallow"
							label="The current policy allows this case, but most people say that it should be disallowed"
						/>
						<Select.Item
							value="allow"
							label="The current policy disallows this case, but most people say that it should be allowed"
						/>
						<Select.Item
							value="unsure"
							label="The current policy is ambiguous about whether this case should be allowed or not"
						/>
						<Select.Item value="unrelated" label="This case is unrelated to the current policy" />
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
		{#if showLinktoEditCase}
			<Button variant="secondary" class="mx-3" href="/policies/{policyId}/editcase">
				Visit edit case page
			</Button>
		{/if}
		{#if showUnsureSelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						showUnsureSelector = false;
						loading = true;
						await updateMessageHistory('You', v?.label);
						if (v?.value == 'allow' || v?.value == 'disallow') {
							selectedCaseLabel = v?.value;
							if (cases.get(selectedCaseId).reasons.length !== 0) {
								selectedCaseReasons = cases
									.get(selectedCaseId)
									.reasons.filter((c) => c.label == selectedCaseLabel);
								if (selectedCaseReasons.length !== 0) {
									await updateMessageHistory(
										'AI Assistant',
										`Why should this case be ` +
											selectedCaseLabel +
											`ed? Please select a reason that others have submitted for this case, or briefly explain your own reason. You may click on the related case on this page to view the details of each reason.`
									);
									showReasonSelector = true;
								} else {
									await updateMessageHistory(
										'AI Assistant',
										`Why should this case be ` +
											selectedCaseLabel +
											`ed? Please briefly explain the reason.`
									);
									showReasonMunualInput = true;
								}
							} else {
								await updateMessageHistory(
									'AI Assistant',
									`Why should this case be ` +
										selectedCaseLabel +
										`ed? Please briefly explain the reason.`
								);
								showReasonMunualInput = true;
							}
						} else {
							await updateMessageHistory(
								'AI Assistant',
								`Please consider discussing the case more before editing the policy based on a case where most people are unsure.`
							);
							// TODO HERE
						}
						loading = false;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select a condition" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="allow" label="The case should be allowed" />
						<Select.Item value="disallow" label="The case should be disallowed" />
						<Select.Item value="unsure" label="The case is unsure by itself" />
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
		{#if showReasonSelector}
			<div class="mx-3 mt-1">
				<Select.Root
					onSelectedChange={async (v) => {
						showReasonSelector = false;
						loading = true;
						if (v?.value == 'manual') {
							await updateMessageHistory('You', v?.label);
							showReasonMunualInput = true;
						} else {
							await updateMessageHistory('You', v?.value);
							selectedCaseReason = v?.value;
							await generatePolicy();
						}
						loading = false;
					}}
				>
					<Select.Trigger>
						<Select.Value placeholder="Select or enter a reason manually" />
					</Select.Trigger>
					<Select.Content>
						{#each selectedCaseReasons as reason (reason.id)}
							<Select.Item
								value={reason.description}
								label={reason.description.length > 47
									? reason.description.substring(0, 47) + '...'
									: reason.description}
							/>
						{/each}
						<Select.Item value="manual" label="Enter a reason manually" />
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
		{#if showReasonMunualInput}
			<div class="mx-3 mt-1">
				<Input
					placeholder={'The case should be ' + selectedCaseLabel + ' because ...'}
					bind:value={manualInputValue}
					on:keypress={async (e) => {
						if (e.key === 'Enter') {
							showReasonMunualInput = false;
							loading = true;
							selectedCaseReason = manualInputValue;
							await updateMessageHistory('You', manualInputValue);
							await generatePolicy();
							manualInputValue = '';
							loading = false;
						}
					}}
				/>
			</div>
		{/if}
		{#if showInstructionInput}
			<div class="mx-3 mt-1">
				<Input
					placeholder={'Please edit the policy so that ...'}
					bind:value={iterateInstruction}
					on:keypress={async (e) => {
						if (e.key === 'Enter') {
							showInstructionInput = false;
							loading = true;
							await updateMessageHistory('You', iterateInstruction);
							await iteratePolicy();
							loading = false;
						}
					}}
				/>
			</div>
		{/if}
		{#if showRestartBtn}
			<Button
				bind:disabled={loading}
				variant="secondary"
				class="mx-3"
				on:click={async () => {
					resetButtonAndData();
					await updateMessageHistory(
						'AI Assistant',
						`To restart, please select a related case below.`
					);
					showCaseSelector = true;
				}}>Restart</Button
			>
		{/if}
	</div>
</ScrollArea>
