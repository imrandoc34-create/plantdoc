export const companionData = {
  Tomato: {
    name: 'Tomato',
    icon: '🍅',
    category: 'Vegetables',
    companions: ['Basil', 'Carrot', 'Onion', 'Marigold', 'Chives'],
    combatants: ['Potato', 'Corn', 'Mint'],
    details: {
      Basil: 'Basil repels thrips, hornworms, and whiteflies, and improves tomato health and flavor.',
      Carrot: 'Carrots break up the soil around tomato roots, though tomatoes may shade carrots if placed too close.',
      Onion: 'Onions repel aphids, spider mites, and cabbage loopers with their strong scent.',
      Marigold: 'Marigolds release chemicals into the soil that kill root-knot nematodes and repel garden pests.',
      Chives: 'Chives improve flavor, deter aphids, and help prevent black spot disease.',
      Potato: 'Potatoes and tomatoes are both nightshades and share vulnerability to early/late blight and potato beetles.',
      Corn: 'Corn earworms are the same species as tomato fruitworms. Planting them together multiplies pest damage.',
      Mint: 'Mint is a heavy feeder that competes for soil moisture, and can spread invasively into tomato root zones.'
    }
  },
  Basil: {
    name: 'Basil',
    icon: '🌿',
    category: 'Herbs',
    companions: ['Tomato', 'Bell Pepper', 'Marigold', 'Chives'],
    combatants: ['Mint', 'Rosemary'],
    details: {
      Tomato: 'Basil improves tomato flavor and repels hornworms, thrips, and flies.',
      'Bell Pepper': 'Basil helps repel aphids, spider mites, and thrips while conserving soil humidity.',
      Marigold: 'Marigolds and basil together create a powerful pest-repelling aroma shield.',
      Chives: 'Chives and basil thrive in similar moist, well-draining soil and repel aphids.',
      Mint: 'Mint is too aggressive and will easily crowd out basil roots and steal water.',
      Rosemary: 'Rosemary prefers dry, sandy soil, whereas basil requires rich, moist soil, causing conflicting water needs.'
    }
  },
  Carrot: {
    name: 'Carrot',
    icon: '🥕',
    category: 'Vegetables',
    companions: ['Tomato', 'Onion', 'Rosemary', 'Lettuce', 'Chives'],
    combatants: ['Dill', 'Parsley'],
    details: {
      Tomato: 'Tomatoes provide light shade for carrots, and carrots aerate the soil for tomato roots.',
      Onion: 'Onions mask the scent of carrots, repelling the destructive carrot rust fly.',
      Rosemary: 'Rosemary\'s aromatic leaves help deter the carrot rust fly from laying eggs.',
      Lettuce: 'Lettuce has shallow roots that grow quickly, sharing space perfectly without crowding carrots.',
      Chives: 'Chives improve carrot flavor and help deter common insect pests.',
      Dill: 'Dill can cross-pollinate with carrots, producing bitter seeds, and attracts pests that stunt carrot roots.',
      Parsley: 'Parsley is in the same family as carrots and can attract carrot rust flies, compounding pest pressure.'
    }
  },
  Onion: {
    name: 'Onion',
    icon: '🧅',
    category: 'Vegetables',
    companions: ['Carrot', 'Lettuce', 'Tomato', 'Cabbage', 'Chives'],
    combatants: ['Asparagus', 'Parsley'],
    details: {
      Carrot: 'Onions deter the carrot rust fly, while carrots break up compacted soil for bulbs.',
      Lettuce: 'Lettuce\'s shallow root system doesn\'t compete with onions, and onions repel aphids from lettuce leaves.',
      Tomato: 'Onions repel common tomato pests like spider mites and thrips.',
      Cabbage: 'Onions act as a pest deterrent for cabbage loopers, aphids, and weevils.',
      Chives: 'Chives and onions are companions, but should not be overcrowded to prevent rust disease.',
      Asparagus: 'Onions can stunt the growth of asparagus and compete heavily for underground soil space.',
      Parsley: 'Parsley competes for moisture and nutrients, reducing the size of onion bulbs.'
    }
  },
  Potato: {
    name: 'Potato',
    icon: '🥔',
    category: 'Vegetables',
    companions: ['Corn', 'Thyme', 'Marigold', 'Chives'],
    combatants: ['Tomato', 'Cucumber', 'Rosemary'],
    details: {
      Corn: 'Corn provides light shade for potatoes and shields them from strong winds.',
      Thyme: 'Thyme acts as an aromatic groundcover that deters potato beetles.',
      Marigold: 'Marigolds repel harmful wireworms and nematodes from potato tubers.',
      Chives: 'Chives deter aphids and beetles, and have non-invasive root systems.',
      Tomato: 'Tomatoes and potatoes are nightshades that easily spread early and late blight to one another.',
      Cucumber: 'Cucumbers encourage potato blight and compete heavily for space and water.',
      Rosemary: 'Rosemary prefers dry, sandy soil, while potatoes need consistent moisture to form healthy tubers.'
    }
  },
  Cabbage: {
    name: 'Cabbage',
    icon: '🥬',
    category: 'Vegetables',
    companions: ['Mint', 'Rosemary', 'Thyme', 'Dill', 'Onion'],
    combatants: ['Tomato', 'Lettuce'],
    details: {
      Mint: 'Mint strongly deters cabbage moths and ants, protecting the crop leaves.',
      Rosemary: 'Rosemary repels cabbage moths and flies with its strong evergreen scent.',
      Thyme: 'Thyme acts as an aromatic deterrent for cabbage loopers and worms.',
      Dill: 'Dill attracts beneficial predatory wasps that feed on destructive cabbage worms.',
      Onion: 'Onions repel aphids and thrips that attack brassicas.',
      Tomato: 'Tomatoes stunt cabbage growth and both are heavy feeders that deplete the soil of nitrogen.',
      Lettuce: 'Cabbage grows large and shades out lettuce, and they compete for the same shallow nutrients.'
    }
  },
  Cucumber: {
    name: 'Cucumber',
    icon: '🥒',
    category: 'Vegetables',
    companions: ['Dill', 'Corn', 'Marigold', 'Lettuce'],
    combatants: ['Potato', 'Rosemary'],
    details: {
      Dill: 'Dill flowers attract beneficial predatory insects and pollinators to boost cucumber yields.',
      Corn: 'Corn stalks provide a natural trellis for cucumber vines to climb, saving ground space.',
      Marigold: 'Marigolds repel cucumber beetles and nematodes.',
      Lettuce: 'Lettuce grows quickly underneath cucumber leaves, benefiting from the afternoon shade.',
      Potato: 'Potatoes encourage cucumber blight, and digging up potatoes can damage shallow cucumber roots.',
      Rosemary: 'Rosemary prefers dry conditions, conflicting with the high water requirements of cucumbers.'
    }
  },
  Mint: {
    name: 'Mint',
    icon: '🌱',
    category: 'Herbs',
    companions: ['Cabbage', 'Tomato', 'Marigold'],
    combatants: ['Basil', 'Rosemary'],
    details: {
      Cabbage: 'Mint repels cabbage moths, keeping brassica leaves green and intact.',
      Tomato: 'Mint improves tomato health and repels aphids, but should be confined to prevent choking tomato roots.',
      Marigold: 'Both plants are highly aromatic and repel a wide spectrum of garden pests.',
      Basil: 'Mint is highly invasive and will easily choke out basil roots and monopolize water.',
      Rosemary: 'Mint requires damp soil, while rosemary prefers hot, dry conditions, creating conflicting moisture needs.'
    }
  },
  Marigold: {
    name: 'Marigold',
    icon: '🌼',
    category: 'Flowers',
    companions: ['Tomato', 'Potato', 'Cucumber', 'Basil', 'Mint'],
    combatants: [],
    details: {
      Tomato: 'Marigolds repel root-knot nematodes and mask the scent of tomato plants from aphids and flies.',
      Potato: 'Marigolds suppress nematodes and deter wireworms and potato beetles.',
      Cucumber: 'Marigolds repel cucumber beetles and attract beneficial pollinators.',
      Basil: 'Marigolds and basil create a dual aromatic shield that deters flying pests.',
      Mint: 'Highly aromatic companions that together create a powerful insect repellent boundary.'
    }
  },
  Corn: {
    name: 'Corn',
    icon: '🌽',
    category: 'Grains',
    companions: ['Potato', 'Cucumber', 'Marigold'],
    combatants: ['Tomato'],
    details: {
      Potato: 'Corn provides shade and shelter for potatoes without competing for root depth.',
      Cucumber: 'Cucumber vines climb corn stalks for structural support, while cucumber leaves shade the soil.',
      Marigold: 'Marigolds repel beetles and attract key pollinators for corn silk.',
      Tomato: 'Corn earworm and tomato fruitworm are the same pest. Planting them together creates a severe pest magnet.'
    }
  }
};
