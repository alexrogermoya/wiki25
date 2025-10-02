document.addEventListener('DOMContentLoaded', function() {
    // Variables for component selection
    const componentCards = document.querySelectorAll('.component-card');
    const cyclesContainers = document.querySelectorAll('.cycles-container');
    
    // Variables for cycle selection
    const cycleCards = document.querySelectorAll('.cycle-card');
    const dbtlSection = document.getElementById('dbtl-section');
    const conclusions = document.getElementById('conclusions');
    
    // Variables for back to top
    // const backToTopBtn = document.getElementById('back-to-top');
    
    // Variables for DBTL visualization
    const phasesColumn = document.getElementById('phases-column');
    const circleSvg = document.getElementById('circle-svg');
    const centerPoint = document.querySelector('.center-point');
    const completionTickContainer = document.getElementById('completion-tick-container');
    const scrollSpacer = document.getElementById('scroll-spacer');
    
    // Variables para navegación entre iteraciones
    const iterationNavigation = document.getElementById('iteration-navigation');
    const iterationIndicator = document.getElementById('iteration-indicator');
    const prevIterationBtn = document.getElementById('prev-iteration-btn');
    const nextIterationBtn = document.getElementById('next-iteration-btn');
    
    // Current state
    let currentComponent = null;
    let currentCycle = null;
    let currentIterations = 0;
    let currentIteration = 1;
    let currentPhase = 0;
    let scrollEnabled = true;
    let lastScrollPosition = 0;
    
    // Fases DBTL
    const phases = ['design', 'build', 'test', 'learn'];
    
    // Cycle data with specific iteration names and phase content
    // To add an image:
    // design: `We designed a computational approach using AlphaFold2 and ColabFold to predict the 3D structure of SCR-D. The design focused on identifying key structural motifs and binding sites.
                            
    //                         <div class="image-container">
    //                             <img src="https://via.placeholder.com/400x250/FF5249/FFFFFF?text=AlphaFold2+Pipeline" alt="AlphaFold2 Pipeline Design">
    //                             <div class="photo-caption">Figure 1: Computational pipeline design for SCR-D structure prediction using AlphaFold2</div>
    //                         </div>`,
    const cycleData = {
        'dark-structure': {
            1: {
                name: 'SCR-D Structure Prediction',
                iterations: [
                    {
                        name: 'Structure Prediction with Bioinformatics Tools',
                        phases: {
                            design: 'Our first objective was to identify the structure of the target RNA element to understand its functional motifs. We hypothesized that existing computational tools could predict a consistent structure. We tested multiple 3D predictors, including AlphaFold, FARNA, RNAComposer, and Vfold. We referred to a recent review on RNA structure prediction to guide our choices [1].',
                            build: 'We ran our RNA sequence through AlphaFold, FARNA, RNAComposer, and Vfold.',
                            test: 'The results were inconsistent; the predicted structures from different tools varied significantly.',
                            learn: 'The lack of a consensus structure indicated that we needed to introduce additional biological constraints to guide the prediction. We concluded that leveraging evolutionary conservation data would provide the necessary evidence to move forward.'
                        }
                    },
                    {
                        name: 'Coevolutionary Analysis',
                        phases: {
                            design: 'The limitations of the initial approach led to a new design focused on leveraging evolutionary conservation data. Our hypothesis was that conserved secondary structures would correlate with functionally important motifs. We used the RNAz tool, which is designed to detect conserved secondary structures across species [2].',
                            build: 'We collected sequences from 22 Drosophila species, as the gene of interest is from Drosophila, and ran the RNAz analysis on the multiple sequence alignment (MSA).',
                            test: 'The RNAz analysis did not detect a fully conserved consensus structure across the species.',
                            learn: 'We learned that RNAz\'s limitation to fully conserved structures meant it could fail to detect functional motifs that might be conserved at the substructure level. This observation prompted us to design a more granular approach to identify these specific motifs.'
                        }
                    },
                    {
                        name: 'Structure Prediction with Bioinformatics Tools',
                        phases: {
                            design: 'Our first objective was to identify the structure of the target RNA element to understand its functional motifs. We hypothesized that existing computational tools could predict a consistent structure. We tested multiple 3D predictors, including AlphaFold, FARNA, RNAComposer, and Vfold. We referred to a recent review on RNA structure prediction to guide our choices [1].',
                            build: 'We ran our RNA sequence through AlphaFold, FARNA, RNAComposer, and Vfold.',
                            test: 'The results were inconsistent; the predicted structures from different tools varied significantly.',
                            learn: 'The lack of a consensus structure indicated that we needed to introduce additional biological constraints to guide the prediction. We concluded that leveraging evolutionary conservation data would provide the necessary evidence to move forward.'
                        }
                    },
                    {
                        name: 'Structure Prediction with Bioinformatics Tools',
                        phases: {
                            design: 'Our first objective was to identify the structure of the target RNA element to understand its functional motifs. We hypothesized that existing computational tools could predict a consistent structure. We tested multiple 3D predictors, including AlphaFold, FARNA, RNAComposer, and Vfold. We referred to a recent review on RNA structure prediction to guide our choices [1].',
                            build: 'We ran our RNA sequence through AlphaFold, FARNA, RNAComposer, and Vfold.',
                            test: 'The results were inconsistent; the predicted structures from different tools varied significantly.',
                            learn: 'The lack of a consensus structure indicated that we needed to introduce additional biological constraints to guide the prediction. We concluded that leveraging evolutionary conservation data would provide the necessary evidence to move forward.'
                        }
                    }
            ]
                },
                2: {
                    name: 'Coevolutionary Analysis of SCR',
                    iterations: [
                        {
                            name: 'Manual Conservation Structural Analysis',
                            phases: {
                                design: 'To overcome the limitations of RNAz, we designed a new method for conservation structural analysis [3]. Our hypothesis was that we could identify functionally important motifs by focusing on regions with high conservation within a 2D structure.',
                                build: 'We used a well-established 2D RNA predictor, RNAfold [4], and manually overlaid nucleotide conservation data from the MSA.',
                                test: 'This process generated a visual representation of the predicted structure with a color-coded conservation map, revealing a substructure with high conservation and complementary base pairing.',
                                learn: 'The highly conserved region was identified as a likely functional motif. We also learned that this manual method was very time-consuming (taking two days per analysis), highlighting the need for an automated solution.'
                            }
                        },
                        {
                            name: 'Automation of the Coevolutionary Analysis',
                            phases: {
                                design: 'Based on the previous iteration\'s finding, we designed a new tool to automate the manual process. The goal was to create a solution that was accurate but also fast, reproducible, and accessible to others.',
                                build: 'We developed a web-deployable software tool based on RNAfold. The tool automatically overlays nucleotide conservation scores onto the predicted 2D structures and compares base pairings across species to highlight conserved complementarity.',
                                test: `White nucleotides: not paired, so the analysis does not apply<br>
                                        Yellow: pairings are not conserved<br>
                                        Blue: pairings are almost always conserved (except in up to two sequences)<br>
                                        Red: always conserved.<br>
                                        Confirmed earlier prediction: conserved motif is structurally feasible in all species.
                                        <div class="image-container">
                                          <img src="https://static.igem.wiki/teams/5622/images/engineering/engineerin-1.webp" alt="AlphaFold2 Pipeline Design">
                                          <div class="photo-caption">Figure 1: Computational pipeline design for SCR-D structure prediction using AlphaFold2</div>
                                        </div>`,
                                learn: 'The developed tool provides a faster, more reproducible, and accessible workflow for identifying conserved structural motifs. This scalable approach goes beyond the specific needs of our project and can be used to analyze a wide range of RNA elements.'
                            }
                        },
                        {
                            name: 'Identification of key structural elements',
                            phases: {
                                  design: `
                                    From the resulting data obtained from Cycle 2, we were able to increase our accuracy predicting SCR-D's secondary structure, from which we delimited regions of interest. Our goal is to generate multiple constructs including different regions in order to test their relevance in SCR-D's function. 

                                    <p>We have a series of hypotheses we wish to confirm with these experiments:</p>
                                    <ul>
                                      <li><strong>Hypothesis 1:</strong> The Pre-diapin sequence is highly important to cause a readthrough.<br>
                                      <em>Argument:</em> The high conservation of the sequence observed in the co-evolutionary study suggests it has a key role in the readthrough's function.</li>

                                      <li><strong>Hypothesis 2:</strong> The Diapin structure is important to cause a readthrough.<br>
                                      <em>Argument:</em> The Diapin region's structure shows high conservation from the co-evolutionary study, and whilst it does not necessarily conserve the exact sequence, it conserves complementary pairings that maintain its secondary structure as predicted by bioinformatic tools.</li>

                                      <li><strong>Hypothesis 3:</strong> The Hypopin's sequence and structure might play a small role in the function of the readthrough.<br>
                                      <em>Argument:</em> The results of the co-evolutionary study do not show high conservation of the sequence, suggesting a lower importance in the function of the readthrough.</li>
                                    </ul>

                                    <p>To confirm the aforementioned hypotheses, we generated constructs that either maintain or eliminate certain regions of the stop codon readthrough element, or that modify sequences but preserve secondary structure. Below are the designs:</p>

                                    <table style="border-collapse: collapse; width: 100%; text-align: left;">
                                      <thead>
                                        <tr>
                                          <th style="border: 1px solid #ccc; padding: 6px;">Name</th>
                                          <th style="border: 1px solid #ccc; padding: 6px;">Pertaining Hypothesis</th>
                                          <th style="border: 1px solid #ccc; padding: 6px;">Modifications</th>
                                          <th style="border: 1px solid #ccc; padding: 6px;">Registry name</th>
                                          <th style="border: 1px solid #ccc; padding: 6px;">Predicted structure</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Pre - diapin</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Hypothesis 1</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Removed Diapin, Hypopin and Post-hypopin, maintaining only the Pre-diapin region.</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">TBD</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Imatge &gt; 1.3.1: Pre-diapin - Predicted structure</td>
                                        </tr>
                                        <tr>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Modified diapin</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Hypothesis 2</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Altered conserved base pairings of the Diapin region to maintain its structure whilst modifying its sequence.</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">TBD</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Imatge &gt; 1.3.1: Modified diapin - Predicted structure</td>
                                        </tr>
                                        <tr>
                                          <td style="border: 1px solid #ccc; padding: 6px;">No Hypopin</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Hypothesis 3</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Removed Hypopin and post-hypopin regions, maintaining the Pre–diapin and Diapin regions.</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">TBD</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Imatge &gt; 1.3.1: Pre+diapin - Predicted structure</td>
                                        </tr>
                                      </tbody>
                                    </table>

                                    <p><em>*Llegenda → Imatge &gt; 1.3.1: Llegenda - Predicted structures</em></p>
                                  `,
                                  build: `
                                    The different constructs were introduced in the “Mod SCR-D” section of the plasmid, which was ordered to be synthesised by Genscript. Upon receiving the plasmid, we verified its sequence with Sanger sequencing and amplified the plasmid sample. 
                                    <br><br>
                                    Imatge &gt; 1.3.2 PLASMID
                                  `,
                                  test: `
                                    Constructs were transfected into HEK293 human cells, and cultivated. 
                                    We then analysed Renilla and Firefly Luciferases’ reporter levels using the Dual-Luciferase® Reporter Assay System from Promega.
                                  `,
                                  learn: `
                                    The only conserved structure (diapin) is not important for function, therefore the functionality does not depend on the structure. <br> 
                                    This allowed us to determine the particular nucleotides stimulation readthrough to get a more compact tool.
                                  `
                                }

                    }
             ]
            }
            },
            'aptamer': {
                1: {
                    name: 'SCR element',
                    iterations: [
                        {
                            name: 'SCR-D as a Switch Candidate',
                            phases: {
                                design: 'For this first iteration, we attempted to design an inducible SCR by fusing the SCR-D sequence to the theophylline aptamer [5]. Our hypothesis was that we could create an ON/OFF system by disrupting a key functional structure of the SCR-D element with the aptamer.',
                                build: 'We joined the theophylline aptamer with the SCR-D element and designed an ON/OFF configuration in which the Diapin structure was disrupted.',
                                test: 'We had to first test if the Diapin was important for function, as its disruption would create the OFF state.',
                                learn: 'As established in the Cycle 2, Iteration 3 Learn phase, the Diapin proved to be non-essential for function. Therefore, the SCR-D had no substructure that we could use to build our switch. We learned that we needed to find a new SCR element to continue with our project.'
                            }
                        },
                        {
                            name: 'Selecting a New SCR Element (SECIS)',
                            phases: {
                                design: 'Based on the failure of SCR-D, we searched for a new SCR element whose function was strictly dependent on its secondary structure. The SECIS element (SElenoCysteine Insertion Sequence) [3] was a promising candidate because its function in translational regulation is directly linked to its secondary and tertiary structure. We hypothesized that we could create an ON/OFF system by disrupting the SECIS structure with a ligand-responsive aptamer.',
                                build: 'We searched for information about known SECIS elements and began the computational design of our constructs.',
                                test: 'We consulted with an expert on SECIS elements, Dr. Copeland, to validate our approach. He confirmed that the SECIS element was a viable candidate and provided guidance on determining the experimental conditions necessary for our project.',
                                learn: 'The expert consultation confirmed that a specific, well-characterized SECIS element was required to proceed with the experimental phase, leading to the next iteration.'
                            }
                        },
                        {
                            name: 'Choosing the DIO2 SECIS Element',
                            phases: {
                                design: 'We chose to focus on the SECIS element from the human DIO2 gene for our system [6]. This specific SECIS was selected because its function is well-documented, and it is known to be a strong and stable element. Our hypothesis was that by using a well-characterized element, we could increase the chances of creating a functional switch with predictable behavior.',
                                build: 'We built a construct containing only the DIO2 SECIS element, isolated from the rest of the system.',
                                test: 'We are currently in the process of testing this isolated SECIS construct in the lab to confirm its function on its own.',
                                learn: '(The results of the experiments with the isolated DIO2 SECIS element would go here).'
                            }
                        }
                    ]
                },
                2: {
                    name: 'Aptamer',
                    iterations: [
                        {
                            name: 'Selecting the Theophylline Aptamer',
                            phases: {
                                design: 'The goal was to select a suitable aptamer to serve as our ligand-responsive component. We chose the theophylline aptamer as a candidate due to several key advantages documented in the literature: High specificity: It binds with high specificity to its ligand, theophylline. The binding affinity is 10,000-fold greater than for caffeine, a closely related molecule [7]. Synthetic ligand: Theophylline is not naturally found in mammalian cells [8]. It has also been previously used safely on HEK cells [9], which are highly relevant as these are the cells used for the experimental part of this project. Cross-system functionality: It has been shown to work in both prokaryotic [10] and eukaryotic [11] systems. Defined structure: Its secondary structure is well understood [12], simplifying its use in a structure-based design. Design flexibility: Multiple versions of the aptamer are available, allowing for optimisation.',
                                build: 'We performed a thorough literature review to collect and analyze information on the theophylline aptamer\'s known properties and its behavior in different systems.',
                                test: 'We used the data from our literature review to evaluate the aptamer\'s potential for our project. This literature-based test confirmed that the aptamer was a viable candidate.',
                                learn: 'Our review revealed that not all versions of the aptamer were equally effective. The need for a robust and highly active variant became clear, which led us to the next iteration.'
                            }
                        },
                        {
                            name: 'Choosing the Theo-ON-5 Variant',
                            phases: {
                                design: 'Building on the previous learning, we needed a highly effective and validated aptamer variant. After a thorough review, we chose the Theo-ON-5 variant [13]. This specific aptamer was selected because it demonstrated the largest difference in frameshift percentage (the ON/OFF ratio) in a conceptually similar published study. We hypothesized that by using this robust and experimentally validated variant, we could maximize the efficiency of our synthetic switch.',
                                build: 'We constructed a separate plasmid containing the Theo-ON-5 aptamer, linked to a frameshift [13] to confirm its function independently.',
                                test: 'We are currently in the process of testing this specific aptamer construct in the lab to confirm its performance on its own.',
                                learn: '(The results from the experiments would go here, leading to a new Design if further optimization is needed).'
                            }
                        }
                    ]
                }
            },
            'linker': {
                1: {
                    name: 'Algorithm Refinement',
                    iterations: [
                        {
                            name: 'Brute-Force Search',
                            phases: {
                                design: 'Our initial approach was an exhaustive, brute-force search to identify all possible solutions. The goal was to ensure no viable options were overlooked, applying rigorous structural and energetic criteria.',
                                build: 'We implemented a brute-force search that generated and evaluated all possible linker combinations within a defined range of lengths.',
                                test: 'The tool was functional and found valid solutions. However, execution time was unacceptably high, and the approach proved computationally prohibitive for larger linker lengths or when incorporating mutations.',
                                learn: 'It was concluded that, while guaranteeing all possible solutions, this exhaustive approach was not scalable. A more efficient, heuristic method was required that prioritized promising areas of the search space without exhaustively evaluating it.'
                            }
                        },
                        {
                            name: 'Genetic Algorithm (GA)',
                            phases: {
                                design: 'Based on the limitations of the brute-force method, we decided to implement a genetic algorithm. This approach leveraged its ability to efficiently search vast, complex spaces by intelligently exploring only the most promising candidates.',
                                build: 'We developed a GA with an initial population of linkers, defined genetic operators (mutation and crossover), and a fitness function based on the principles for a switch to work.',
                                test: 'The GA successfully found high-quality solutions in a fraction of the time required by the brute-force method. However, when analysing the results, it was found that it generated a great diversity of solutions, some of which were structurally very similar, complicating their subsequent analysis.',
                                learn: 'While performance improved, the interpretability of the results needed enhancement. The abundance of similar solutions required a way to organize them to facilitate user decision-making and selection.'
                            }
                        },
                        {
                            name: 'Clustering',
                            phases: {
                                design: 'To address the challenge of solution diversity, we proposed applying clustering to the generated secondary structures. This user-centric improvement would group structurally similar results, making the vast output more manageable.',
                                build: 'We extracted structural descriptors and applied clustering algorithms, such as DBSCAN [14], to the structural representation of the systems. The resulting labels were then used to organize the output within the user interface.',
                                test: 'Users could now easily identify groups of structurally similar solutions, which made the selection and prioritization process more manageable and intuitive.',
                                learn: 'Clustering proved to be a key improvement in the user experience. It was identified as a valuable step for both exploratory analysis and for justifying the selection of candidates for future experimental validation.'
                            }
                        }
                    ]
                },
                2: {
                    name: 'Deployment and Accessibility',
                    iterations: [
                        {
                            name: 'Python Scripts',
                            phases: {
                                design: 'The application was initially conceived as a series of standalone Python scripts. This approach was ideal for rapidly validating the internal functioning of each module (linker design, structural prediction, filtering, report generation, etc.).',
                                build: 'We developed a set of independent scripts that could be executed manually from the terminal.',
                                test: 'The scripts functioned correctly in controlled development environments. However, their use by other team members or external users was hindered by the requirement for specific technical knowledge and a complex setup process.',
                                learn: 'We identified the critical need for a more accessible interface for non-experts and a centralized environment for the entire workflow.'
                            }
                        },
                        {
                            name: 'Streamlit Interface',
                            phases: {
                                design: 'To create an accessible graphical interface, we proposed using Streamlit [15]. This allowed us to reuse the Python logic while enabling the entire process to be run from a web browser.',
                                build: 'The prediction, selection, visualization, and report generation modules were integrated into a single Streamlit application with a clean, interactive user interface.',
                                test: 'The user experience improved dramatically, as the entire system could be used without requiring terminal access. However, low-level dependencies (like ViennaRNA [4] and Ghostscript -ghostscript.com.) caused significant compatibility issues during initial attempts to deploy the application.',
                                learn: 'The Streamlit interface made the tool very user-friendly to work with, but its deployment requirements still made it difficult to access for many non-expert users. We decided to explore a more straightforward hosting solution.'
                            }
                        },
                        {
                            name: 'Render Deployment',
                            phases: {
                                design: 'Seeking a simple cloud deployment solution for public demonstration, we chose Render (render.com) for its ease of use and compatibility with open-source projects.',
                                build: 'The application was configured to run automatically on Render via a custom startup command. Environment files were adjusted to fit the platform\'s requirements.',
                                test: 'The public demo was successfully launched on Render, and feedback from other users confirmed its functionality.',
                                learn: 'Render proved to be a perfect solution for non-developers, providing a direct link to a functioning version of our tool. However, if we want our tool to be able to grow and be modified by other developers, we also need to provide a robust solution for them. This led us to our next iteration.'
                            }
                        },
                        {
                            name: 'Docker',
                            phases: {
                                design: 'To ensure full portability, reproducibility, and guaranteed compatibility with all system dependencies, we made the final decision to create a custom Docker image. This would encapsulate the entire application and its environment.',
                                build: 'We began the definition of a Dockerfile, including the installation of all necessary system and Python dependencies. This approach ensures the application runs identically on any machine or server compatible with Docker.',
                                test: 'The goal is to provide a robust deployment solution that is immune to external environment issues. The Docker image allows for both local execution and deployment on private servers, ensuring that all functions are available without compromise.',
                                learn: 'Docker is the definitive solution for deployment in complex scientific environments. It offers scalability, portability, and complete control over the execution environment, which are crucial attributes for a software tool designed for the broader synthetic biology community.'
                            }
                        }
                    ]
                }
            }
    };
   
    
    // Component selection
    componentCards.forEach(card => {
        card.addEventListener('click', function() {
            const component = this.dataset.component;
            
            // Reset all cards
            componentCards.forEach(c => c.classList.remove('active'));
            
            // Activate selected card
            this.classList.add('active');
            
            // Hide all cycle containers
            cyclesContainers.forEach(container => container.classList.remove('show'));
            
            // Show selected component cycles
            document.getElementById(`${component}-cycles`).classList.add('show');
            
            // Update current component
            currentComponent = component;
            
            // Hide DBTL section and conclusions if shown
            dbtlSection.classList.remove('show');
            conclusions.classList.remove('show');
            iterationNavigation.classList.remove('show');
            
            // Reset current cycle
            currentCycle = null;
            currentIterations = 0;
            currentIteration = 1;
            currentPhase = 0;
        });
    });
    
    // Cycle selection
    cycleCards.forEach(card => {
        card.addEventListener('click', function() {
            const component = this.dataset.component;
            const cycle = parseInt(this.dataset.cycle);
            const iterations = parseInt(this.dataset.iterations);
            
            // Reset all cycle cards
            cycleCards.forEach(c => c.classList.remove('active'));
            
            // Activate selected cycle
            this.classList.add('active');
            
            // Update current cycle and iterations
            currentCycle = cycle;
            currentIterations = iterations;
            currentIteration = 1;
            currentPhase = 0;
            
            // Generate phases and circles for this cycle
            generatePhasesForCycle(component, cycle, iterations);
            generateCirclesForCycle(iterations);
            
            // Update iteration indicator
            updateIterationIndicator();
            updateNavigationButtons();
            
            // Show DBTL section
            dbtlSection.classList.add('show');
            iterationNavigation.classList.add('show');
            
            // Ajustar la altura del spacer
            scrollSpacer.style.height = `${iterations * 100}vh`;
            
            // Resetear la visualización
            resetVisualization();
            showPhase(1, 'design');
            
            // Scroll to DBTL section
            dbtlSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Navigation buttons
    prevIterationBtn.addEventListener('click', function() {
        if (currentIteration > 1) {
            scrollEnabled = false;
            currentIteration--;
            currentPhase = 0;
            
            hideCompletionTick();
            showPhase(currentIteration, 'design');
            updateIterationIndicator();
            updateNavigationButtons();
            
            const scrollPosition = dbtlSection.offsetTop + ((currentIteration - 1) / currentIterations) * scrollSpacer.offsetHeight;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                scrollEnabled = true;
            }, 1000);
        }
    });
    
    nextIterationBtn.addEventListener('click', function() {
        if (currentIteration < currentIterations) {
            scrollEnabled = false;
            completeCurrentIteration();
            currentIteration++;
            currentPhase = 0;
            
            showPhase(currentIteration, 'design');
            updateIterationIndicator();
            updateNavigationButtons();
            
            if (currentIteration === currentIterations && currentPhase === 3) {
                showCompletionTick();
            } else {
                hideCompletionTick();
            }
            
            const scrollPosition = dbtlSection.offsetTop + ((currentIteration - 1) / currentIterations) * scrollSpacer.offsetHeight;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                scrollEnabled = true;
            }, 1000);
        }
    });
    
    
    // === START REPLACEMENT: Scroll handler & updateVisualization ===

// Scroll handler: drives the DBTL visualization as the user scrolls
    window.addEventListener('scroll', function() {
        // guard conditions
        if (!currentCycle || !dbtlSection.classList.contains('show') || !scrollEnabled) return;

        // compute a stable progress value between 0..1
        const scrollPos = window.scrollY;
        const start = dbtlSection.offsetTop; // when scrollY === start -> progress 0
        const total = scrollSpacer.offsetHeight || (currentIterations * window.innerHeight);
        const progress = Math.max(0, Math.min(1, (scrollPos - start) / total));

        // map progress to iteration and phase
        const iterationProgress = progress * currentIterations;               // 0..currentIterations
        const newIteration = Math.min(
            Math.max(1, Math.floor(iterationProgress) + 1),
            currentIterations
        );

        const intraIterationProgress = (iterationProgress - (newIteration - 1)) * phases.length; // 0..phases.length
        const newPhaseIndex = Math.min(Math.floor(intraIterationProgress), phases.length - 1);
        const newPhase = phases[newPhaseIndex];

        // update state + UI only when something changed
        if (newIteration !== currentIteration || newPhaseIndex !== currentPhase) {
            currentIteration = newIteration;
            currentPhase = newPhaseIndex;
            updateIterationIndicator();
            updateNavigationButtons();
            showPhase(currentIteration, newPhase);
        }

        // completion / conclusions visibility
        if (currentIteration === currentIterations && newPhase === 'learn') {
            showCompletionTick();
            conclusions.classList.add('show');
        } else {
            hideCompletionTick();
            conclusions.classList.remove('show');
        }

        // keep lastScrollPosition for any uses
        lastScrollPosition = scrollPos;
    });

    // Replace the old implementation with this more robust function (kept for backward compatibility)
    function updateVisualization(scrollingDown) {
        if (!currentCycle || !dbtlSection.classList.contains('show')) return;

        const scrollPos = window.scrollY;
        const start = dbtlSection.offsetTop;
        const total = scrollSpacer.offsetHeight || (currentIterations * window.innerHeight);
        const progress = Math.max(0, Math.min(1, (scrollPos - start) / total));

        const iterationProgress = progress * currentIterations;
        const newIteration = Math.min(Math.max(1, Math.floor(iterationProgress) + 1), currentIterations);
        const intraIterationProgress = (iterationProgress - (newIteration - 1)) * phases.length;
        const newPhaseIndex = Math.min(Math.floor(intraIterationProgress), phases.length - 1);
        const newPhase = phases[newPhaseIndex];

        if (newIteration !== currentIteration || newPhaseIndex !== currentPhase) {
            currentIteration = newIteration;
            currentPhase = newPhaseIndex;
            updateIterationIndicator();
            updateNavigationButtons();
            showPhase(currentIteration, newPhase);
        }

        if (currentIteration === currentIterations && newPhase === 'learn') {
            showCompletionTick();
            conclusions.classList.add('show');
        } else {
            hideCompletionTick();
            conclusions.classList.remove('show');
        }
    }
    // === END REPLACEMENT ===

    //Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Generate phases for a cycle
    function generatePhasesForCycle(component, cycle, iterations) {
        phasesColumn.innerHTML = '';
        
        const cycleInfo = cycleData[component][cycle];
        
        for (let iteration = 1; iteration <= iterations; iteration++) {
            phases.forEach((phase, phaseIndex) => {
                const phaseDiv = document.createElement('div');
                phaseDiv.className = `phase phase-${phase}`;
                phaseDiv.dataset.phase = phase;
                phaseDiv.dataset.iteration = iteration;
                
                const iterationData = cycleInfo.iterations[iteration - 1];
                const iterationName = iterationData ? iterationData.name : `Iteration ${iteration}`;
                const phaseContent = iterationData && iterationData.phases ? iterationData.phases[phase] : `[${phase.toUpperCase()} phase content will be added here]`;
                
                phaseDiv.innerHTML = `
                    <div class="iteration-label">${iteration}</div>
                    <div class="phase-title">${phase.charAt(0).toUpperCase() + phase.slice(1)}</div>
                    <div class="phase-description">
                        <strong>${iterationName}</strong><br><br>
                        ${phaseContent}
                    </div>
                `;
                
                phasesColumn.appendChild(phaseDiv);
            });
        }
    }
    
    // Generate circles for a cycle
    function generateCirclesForCycle(iterations) {
        const existingPaths = circleSvg.querySelectorAll('.circle-path');
        existingPaths.forEach(path => path.remove());
        
        const baseRadius = 10;
        const radiusIncrement = 10;
        
        for (let iteration = 1; iteration <= iterations; iteration++) {
            const radius = baseRadius + (iteration - 1) * radiusIncrement;
            
            phases.forEach((phase, phaseIndex) => {
                const startAngle = phaseIndex * Math.PI / 2;
                const endAngle = (phaseIndex + 1) * Math.PI / 2;
                
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.classList.add('circle-path', `section-${phase}`);
                path.dataset.phase = phase;
                path.dataset.iteration = iteration;
                
                const x1 = radius * Math.cos(startAngle);
                const y1 = radius * Math.sin(startAngle);
                const x2 = radius * Math.cos(endAngle);
                const y2 = radius * Math.sin(endAngle);
                
                const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
                path.setAttribute('d', pathData);
                
                circleSvg.appendChild(path);
                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = pathLength;
                path.style.strokeDashoffset = pathLength;
            });
        }
    }
    
    function updateIterationIndicator() {
        iterationIndicator.textContent = `Iteration ${currentIteration} of ${currentIterations}`;
    }
    
    function updateNavigationButtons() {
        prevIterationBtn.disabled = currentIteration <= 1;
        nextIterationBtn.disabled = currentIteration >= currentIterations;
    }
    
    function resetVisualization() {
        const phases = document.querySelectorAll('.phase');
        phases.forEach(phase => {
            phase.classList.remove('active');
        });
        
        const circlePaths = document.querySelectorAll('.circle-path');
        circlePaths.forEach(path => {
            path.classList.remove('visible');
            const pathLength = path.getTotalLength();
            path.style.strokeDashoffset = pathLength;
        });
        
        centerPoint.setAttribute('r', '2');
        hideCompletionTick();
        circleSvg.classList.remove('circle-active');
        
        currentIteration = 1;
        currentPhase = 0;
        updateIterationIndicator();
        updateNavigationButtons();
    }
    
    function showPhase(iteration, phase) {
        const allPhases = document.querySelectorAll('.phase');
        allPhases.forEach(p => {
            p.classList.remove('active');
        });
        
        const currentPhaseElement = document.querySelector(`.phase[data-phase="${phase}"][data-iteration="${iteration}"]`);
        if (currentPhaseElement) {
            currentPhaseElement.classList.add('active');
        }
        
        const phaseIndex = phases.indexOf(phase);
        
        // Hide later iterations
        for (let i = iteration + 1; i <= currentIterations; i++) {
            const laterPaths = document.querySelectorAll(`.circle-path[data-iteration="${i}"]`);
            laterPaths.forEach(path => {
                path.classList.remove('visible');
                const pathLength = path.getTotalLength();
                path.style.strokeDashoffset = pathLength;
            });
        }
        
        // Hide later phases in current iteration
        for (let i = phaseIndex + 1; i < phases.length; i++) {
            const laterPath = document.querySelector(`.circle-path[data-phase="${phases[i]}"][data-iteration="${iteration}"]`);
            if (laterPath) {
                laterPath.classList.remove('visible');
                const pathLength = laterPath.getTotalLength();
                laterPath.style.strokeDashoffset = pathLength;
            }
        }
        
        // Show current and previous phases
        for (let i = 0; i <= phaseIndex; i++) {
            const currentPath = document.querySelector(`.circle-path[data-phase="${phases[i]}"][data-iteration="${iteration}"]`);
            if (currentPath) {
                currentPath.classList.add('visible');
                currentPath.style.strokeDashoffset = 0;
            }
        }
        
        // Show all previous iterations
        for (let i = 1; i < iteration; i++) {
            const previousPaths = document.querySelectorAll(`.circle-path[data-iteration="${i}"]`);
            previousPaths.forEach(path => {
                path.classList.add('visible');
                path.style.strokeDashoffset = 0;
            });
        }
        
        if (iteration === currentIterations && phase === 'learn') {
            showCompletionTick();
            conclusions.classList.add('show');
        } else {
            hideCompletionTick();
        }
    }
    
    function completeCurrentIteration() {
        const currentIterationPaths = document.querySelectorAll(`.circle-path[data-iteration="${currentIteration}"]`);
        currentIterationPaths.forEach(path => {
            path.classList.add('visible');
            path.style.strokeDashoffset = 0;
        });
        
        showPhase(currentIteration, 'learn');
        
        if (currentIteration === currentIterations) {
            showCompletionTick();
        }
    }
    
    function showCompletionTick() {
        centerPoint.setAttribute('r', '0');
        completionTickContainer.style.opacity = '1';
        circleSvg.classList.add('circle-active');
    }
    
    function hideCompletionTick() {
        centerPoint.setAttribute('r', '2');
        completionTickContainer.style.opacity = '0';
        circleSvg.classList.remove('circle-active');
    }
    
    
});