import React from 'react'

function OrgAvatar({ initials }) {
	return (
		<div class="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-red-500 rounded-full dark:bg-red-600">
			<span class="font-medium text-gray-300">{initials}</span>
		</div>
	)
}

export default OrgAvatar
