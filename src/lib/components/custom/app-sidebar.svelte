<script lang="ts">

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { House, Search, Users, Calendar, Settings } from '@lucide/svelte';

	// Menu items.
	const items = [
		{
			title: 'Dashboard',
			url: '#',
			icon: House
		},
		{
			title: 'Pelanggan',
			url: '#',
			icon: Users
		},
		{
			title: 'Transaksi',
			url: '#',
			icon: Calendar
		},
		{
			title: 'Diskon',
			url: '#',
			icon: Search
		},
		{
			title: 'Mitra',
			url: '#',
			icon: Settings
		},
		{
			title: 'Voucher',
			url: '#',
			icon: Settings
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Setoran</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>