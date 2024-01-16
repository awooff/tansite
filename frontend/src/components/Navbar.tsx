import React from 'react'
import { Box, Flex, Heading } from '@radix-ui/themes'
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { SunIcon } from '@radix-ui/react-icons'
function Navbar() {
  return (
	  <Box>
		  <Flex dir='row' justify={'between'}>
			  <Flex dir='row' gap={'2'} align={'center'}>
				  <SunIcon />
				  <Heading>Syscrack</Heading>
			  </Flex>
			  <Flex dir='row' gap='2'>
				    <NavigationMenu.Root>
					<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Trigger />
						<NavigationMenu.Content>
						<NavigationMenu.Link>
									  Sup
						</NavigationMenu.Link>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Link />
					</NavigationMenu.Item>

					<NavigationMenu.Item>
						<NavigationMenu.Trigger />
						<NavigationMenu.Content>
						<NavigationMenu.Sub>
							<NavigationMenu.List />
							<NavigationMenu.Viewport />
						</NavigationMenu.Sub>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<NavigationMenu.Indicator />
					</NavigationMenu.List>

					<NavigationMenu.Viewport />
				</NavigationMenu.Root>

			  </Flex>
		  </Flex>
	</Box>
  )
}

export default Navbar