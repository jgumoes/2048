# 2048 Clone
I like the game, but I don't like the ads. Also, my brother keeps insisting I only beat the game by using the back button, so I'm making a clone will help get him to shut up and recognise my intellectual superiority.

## Back button

Inspired by a university coursework that led to me researching psychology journals for how to encourage pro-environmental behaviour, I will use pro-social motivators in a cutting-edge scientific technique known as "shame". The game will remember how many times the back button was pressed and will stratify the high-score table accordingly. Also, when the button is pressed, the app will inform the user that that was a "weak move".

## Logic Approach

For a given grid state, when a user swipes in a direction, the Grid class will iterate through the grid in the swipe direction i.e. "left" will go from top to bottom, left to right, and "up" will go bottom to top, left to right. Each element in a line is added to the NewGrid class, which will construct a new grid with the numbers in the expected place, merging if necessary. React will read and draw the new grid state, and will the animations are running, a new number will replace one of the zeros.

TODO: maybe all 4 directions should be pre-calculated, and the class just hands over the correct grid? This could improve performance after swiping, and test for end-game condition.

### Inserting a new tile

After swiping, a new tile needs to be placed in an empty space (represented by 0s). I could just run a random number generator repeatedly until the coordinates it creates point to a 0 in the grid, or I could know where the zeros are and randomly select one of those locations. I prefer the latter as it bounds the maximum time taken to find a valid location, as opposed to random which could be technically infinite and the time taken will increase as the grid fills.

There are two approaches I could take: subtractive and additive. Both approaches maintain an equal probability of any zero being selected. I had a go at both approaches, and wrote a script to time how long an entire swipe will take from the input to when the new tile has been added.

**Subtractive**
NewGrid holds an array of how many 0s are in each line. As numbers are added to that line, the recorded number of zeros is decremented. A random number is generated between 1 and the total number of zeros, and NewGrid finds the location of that zero, calculating the coordinate in the process.
This takes, on average, 10.8 nS to complete a swipe from input to the last tile being placed.

**Additive**
NewGrid creates an empty array. When `nextLine()` is called, it adds all of the coordinates along the line that didn't receive a number. One of those coordinate sets is chosen at random.
TODO: what are the polling results?
