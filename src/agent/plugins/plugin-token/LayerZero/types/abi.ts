export const OFT_ABI = [
	{
		type: "function",
		name: "approvalRequired",
		inputs: [],
		outputs: [{ name: "", type: "bool", internalType: "bool" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "oftVersion",
		inputs: [],
		outputs: [
			{ name: "interfaceId", type: "bytes4", internalType: "bytes4" },
			{ name: "version", type: "uint64", internalType: "uint64" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "quoteOFT",
		inputs: [
			{
				name: "_sendParam",
				type: "tuple",
				internalType: "struct SendParam",
				components: [
					{ name: "dstEid", type: "uint32", internalType: "uint32" },
					{ name: "to", type: "bytes32", internalType: "bytes32" },
					{
						name: "amountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "minAmountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "extraOptions",
						type: "bytes",
						internalType: "bytes",
					},
					{ name: "composeMsg", type: "bytes", internalType: "bytes" },
					{ name: "oftCmd", type: "bytes", internalType: "bytes" },
				],
			},
		],
		outputs: [
			{
				name: "",
				type: "tuple",
				internalType: "struct OFTLimit",
				components: [
					{
						name: "minAmountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "maxAmountLD",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
			{
				name: "oftFeeDetails",
				type: "tuple[]",
				internalType: "struct OFTFeeDetail[]",
				components: [
					{
						name: "feeAmountLD",
						type: "int256",
						internalType: "int256",
					},
					{
						name: "description",
						type: "string",
						internalType: "string",
					},
				],
			},
			{
				name: "",
				type: "tuple",
				internalType: "struct OFTReceipt",
				components: [
					{
						name: "amountSentLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "amountReceivedLD",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "quoteSend",
		inputs: [
			{
				name: "_sendParam",
				type: "tuple",
				internalType: "struct SendParam",
				components: [
					{ name: "dstEid", type: "uint32", internalType: "uint32" },
					{ name: "to", type: "bytes32", internalType: "bytes32" },
					{
						name: "amountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "minAmountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "extraOptions",
						type: "bytes",
						internalType: "bytes",
					},
					{ name: "composeMsg", type: "bytes", internalType: "bytes" },
					{ name: "oftCmd", type: "bytes", internalType: "bytes" },
				],
			},
			{ name: "_payInLzToken", type: "bool", internalType: "bool" },
		],
		outputs: [
			{
				name: "",
				type: "tuple",
				internalType: "struct MessagingFee",
				components: [
					{
						name: "nativeFee",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "lzTokenFee",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "send",
		inputs: [
			{
				name: "_sendParam",
				type: "tuple",
				internalType: "struct SendParam",
				components: [
					{ name: "dstEid", type: "uint32", internalType: "uint32" },
					{ name: "to", type: "bytes32", internalType: "bytes32" },
					{
						name: "amountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "minAmountLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "extraOptions",
						type: "bytes",
						internalType: "bytes",
					},
					{ name: "composeMsg", type: "bytes", internalType: "bytes" },
					{ name: "oftCmd", type: "bytes", internalType: "bytes" },
				],
			},
			{
				name: "_fee",
				type: "tuple",
				internalType: "struct MessagingFee",
				components: [
					{
						name: "nativeFee",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "lzTokenFee",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
			{
				name: "_refundAddress",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "tuple",
				internalType: "struct MessagingReceipt",
				components: [
					{ name: "guid", type: "bytes32", internalType: "bytes32" },
					{ name: "nonce", type: "uint64", internalType: "uint64" },
					{
						name: "fee",
						type: "tuple",
						internalType: "struct MessagingFee",
						components: [
							{
								name: "nativeFee",
								type: "uint256",
								internalType: "uint256",
							},
							{
								name: "lzTokenFee",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
				],
			},
			{
				name: "",
				type: "tuple",
				internalType: "struct OFTReceipt",
				components: [
					{
						name: "amountSentLD",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "amountReceivedLD",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "sharedDecimals",
		inputs: [],
		outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "token",
		inputs: [],
		outputs: [{ name: "", type: "address", internalType: "address" }],
		stateMutability: "view",
	},
	{
		type: "event",
		name: "OFTReceived",
		inputs: [
			{
				name: "guid",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "srcEid",
				type: "uint32",
				indexed: false,
				internalType: "uint32",
			},
			{
				name: "toAddress",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amountReceivedLD",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "OFTSent",
		inputs: [
			{
				name: "guid",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "dstEid",
				type: "uint32",
				indexed: false,
				internalType: "uint32",
			},
			{
				name: "fromAddress",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amountSentLD",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "amountReceivedLD",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{ type: "error", name: "InvalidLocalDecimals", inputs: [] },
	{
		type: "error",
		name: "SlippageExceeded",
		inputs: [
			{ name: "amountLD", type: "uint256", internalType: "uint256" },
			{ name: "minAmountLD", type: "uint256", internalType: "uint256" },
		],
	},
] as const;
