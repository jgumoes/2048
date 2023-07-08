# 2048 Clone
I like the game, but I don't like the ads. Also, my brother keeps insisting I only beat the game by using the back button, so making a clone will help get him to shut up and recognise my intellectual authority.

## Back button

Inspired by a university coursework that led to me researching psychology journals for how to encourage pro-environmental behaviour, I will use pro-social motivators in a cutting-edge scientific technique known as "shame". The game will remember how many times the back button was pressed and will stratify the high-score table accordingly. Also, when the button is pressed, the app will inform the user that that was a "weak move".

## Logic Approach

For a given grid state, when a user swipes in a direction, the Grid class will iterate through the grid in the swipe direction i.e. "left" will go from top to bottom, left to right, and "up" will go bottom to top, left to right. Each element a line is added to the NewGrid class, which will construct a new grid with the numbers in the expected place, merging if necessary. React will read and draw the new grid state, and will the animations are running, a new number will be replace one of the zeros.

TODO: maybe all 4 directions should be pre-calculated, and the class just hands over the correct grid? This could improve performance after swiping, and test for end-game condition.

### Inserting a new tile

NewGrid keeps track of how many places are left in a line when starting a new one. It generates a random number between 0 and (N_zeros - 1) and finds the location of that zero, calculating the coordinate in the process.