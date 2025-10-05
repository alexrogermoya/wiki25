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
                            
    //                         <div class="image-container" style="text-align: center; margin: 20px auto;">
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
                            design: `Our first objective was to identify the structure of the target RNA element to understand its functional motifs. 
                                        We hypothesized that existing computational tools could predict a consistent structure. We tested multiple 3D predictors, 
                                        including AlphaFold, FARNA, RNAComposer, and Vfold. We referred to a recent review on RNA structure prediction to guide our choices [1].`,
                            build: 'We ran our RNA sequence through AlphaFold, FARNA, RNAComposer, and Vfold.',
                            test: 'The results were inconsistent; the predicted structures from different tools varied significantly.',
                            learn: `The lack of a consensus structure indicated that we needed to introduce additional biological constraints to guide the prediction. 
                                        We concluded that leveraging evolutionary conservation data would provide the necessary evidence to move forward.`
                        }
                    },
                    {
                        name: 'Coevolutionary Analysis',
                        phases: {
                            design: `The limitations of the initial approach led to a new design focused on leveraging evolutionary conservation data. 
                                        Our hypothesis was that conserved secondary structures would correlate with functionally important motifs. 
                                        We used the RNAz tool, which is designed to detect conserved secondary structures across species [2].`,
                            build: 'We collected sequences from 22 Drosophila species, as the gene of interest is from Drosophila, and ran the RNAz analysis on the multiple sequence alignment (MSA).',
                            test: 'The RNAz analysis did not detect a fully conserved consensus structure across the species.',
                            learn: `We learned that RNAz\'s limitation to fully conserved structures meant it could fail to detect functional
                                     motifs that might be conserved at the substructure level. This observation prompted us to design a more granular approach to identify these specific motifs.`
                        }
                    },
                    {
                        name: 'Structure Prediction with Bioinformatics Tools',
                        phases: {
                            design: `Our first objective was to identify the structure of the target RNA element to understand its functional motifs. 
                                    We hypothesized that existing computational tools could predict a consistent structure. We tested multiple 3D predictors, 
                                    including AlphaFold, FARNA, RNAComposer, and Vfold. We referred to a recent review on RNA structure prediction to guide our choices [1].`,
                            build: 'We ran our RNA sequence through AlphaFold, FARNA, RNAComposer, and Vfold.',
                            test: 'The results were inconsistent; the predicted structures from different tools varied significantly.',
                            learn: `The lack of a consensus structure indicated that we needed to introduce additional biological constraints to guide the prediction. 
                                        We concluded that leveraging evolutionary conservation data would provide the necessary evidence to move forward.`
                        }
                    },
                    {
                        name: 'Structure Prediction with Bioinformatics Tools',
                        phases: {
                            design: `Our first objective was to identify the structure of the target RNA element to understand its functional motifs. 
                                We hypothesized that existing computational tools could predict a consistent structure. We tested multiple 3D predictors, 
                                including AlphaFold, FARNA, RNAComposer, and Vfold. We referred to a recent review on RNA structure prediction to guide our choices [1].`,
                            build: 'We ran our RNA sequence through AlphaFold, FARNA, RNAComposer, and Vfold.',
                            test: 'The results were inconsistent; the predicted structures from different tools varied significantly.',
                            learn: `The lack of a consensus structure indicated that we needed to introduce additional biological constraints to guide the prediction. 
                                            We concluded that leveraging evolutionary conservation data would provide the necessary evidence to move forward.`
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
                                design: `To overcome the limitations of RNAz, we designed a new method for conservation structural analysis [3].
                                             Our hypothesis was that we could identify functionally important motifs by focusing on regions with high conservation within a 2D structure.`,
                                build: 'We used a well-established 2D RNA predictor, RNAfold [4], and manually overlaid nucleotide conservation data from the MSA.',
                                test: 'This process generated a visual representation of the predicted structure with a color-coded conservation map, revealing a substructure with high conservation and complementary base pairing.',
                                learn: 'The highly conserved region was identified as a likely functional motif. We also learned that this manual method was very time-consuming (taking two days per analysis), highlighting the need for an automated solution.'
                            }
                        },
                        {
                            name: 'Automation of the Coevolutionary Analysis',
                            phases: {
                                design: `Based on the previous iteration\'s finding, we designed a new tool to automate the manual process.
                                         The goal was to create a solution that was accurate but also fast, reproducible, and accessible to others.`,
                                build: `We developed a web-deployable software tool based on RNAfold. The tool automatically overlays nucleotide conservation 
                                                scores onto the predicted 2D structures and compares base pairings across species to highlight conserved complementarity.`,
                                test: `Confirmed earlier prediction: conserved motif is structurally feasible in all species.
                                        <div class="image-container" style="text-align: center; margin: 20px auto;">
                                          <img src="https://static.igem.wiki/teams/5622/images/engineering/pairings-conserved-scr-d.webp" alt="AlphaFold2 Pipeline Design">
                                          <div class="photo-caption">Figure 1.1: Image depicting the conserved pairings from the co-evolutionary structures of SCR-D family sequences.
                                        Blue: unpaired or non-conserved pairings.
                                        Red: pairings conserved in nearly all the sequences
                                        Yellow: always conserved</div>
                                        </div>
                                        

                                        <div class="image-container" style="text-align: center; margin: 20px auto;">
                                          <img src="https://static.igem.wiki/teams/5622/images/engineering/bp-conserved-scr-d.webp" alt="AlphaFold2 Pipeline Design">
                                          <div class="photo-caption">Figure 1.2: Image depicting the conserved nucleotides from the co-evolutionary study of SCR-D family sequences.
                                            Blue: low conserved nucleotides.
                                            Dark red: highly conserved nucleotides
                                            Red: Very highly conserved nucleotides.
                                            Red: highly conserved nucleotides
                                            </div>
                                        </div>`,
                                learn: `The developed tool provides a faster, more reproducible, and accessible workflow for identifying conserved structural motifs.
                                             This scalable approach goes beyond the specific needs of our project and can be used to analyze a wide range of RNA elements.`
                            }
                        },
                        {
                            name: 'Identification of key structural elements',
                            phases: {
                                  design: `
                                    From the resulting data obtained from Cycle 2, we were able to increase our accuracy predicting SCR-D's secondary structure, from which we delimited regions of interest. 
                                    Our goal is to generate multiple constructs including different regions in order to test their relevance in SCR-D's function. 
                                    <p>The delimited structural regions following the sequence evolutionary conservation analysis are the following:</p>
                                    Listed from 5’ to 3’:
                                     <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/3.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 2: Structural Parts of the SCR-D element.</div>
                                     </div>
                                    <ul>
                                    <li>Pre-diapin
                                    <li>Diapin
                                    <li>Hypopin (it includes the Conserved Uracil region)
                                    <li>Post-hypopin
                                    </ul>
                                    According to the results obtained from the previous cycle, we postulated a series of hypotheses we wished to confirm in this cycle:

                                    <p>We have a series of hypotheses we wish to confirm with these experiments:</p>
                                    <ul>
                                      <li><strong>Hypothesis 1:</strong> The Pre-diapin sequence is highly important to cause a readthrough.<br>
                                      <em>Argument:</em> The high conservation of the sequence observed in the co-evolutionary study suggests it has a key role in the readthrough's function.</li>

                                      <li><strong>Hypothesis 2:</strong> The Diapin structure is important to cause a readthrough.<br>
                                      <em>Argument:</em> The Diapin region's structure shows high conservation from the co-evolutionary study, and whilst it does not necessarily conserve 
                                                the exact sequence, it conserves complementary pairings that maintain its secondary structure as predicted by bioinformatic tools.</li>

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
                                          <td style="border: 1px solid #ccc; padding: 6px;">
                                          <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/4.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 3: Pre-diapin - Predicted structure.</div>
                                     </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Modified diapin</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Hypothesis 2</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Altered conserved base pairings of the Diapin region to maintain its structure whilst modifying its sequence.</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">TBD</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">
                                          <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/6.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 4:  Modified diapin - Predicted structure.</div>
                                     </div>
                                         </td>
                                        </tr>
                                        <tr>
                                          <td style="border: 1px solid #ccc; padding: 6px;">No Hypopin</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Hypothesis 3</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">Removed Hypopin and post-hypopin regions, maintaining the Pre–diapin and Diapin regions.</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">TBD</td>
                                          <td style="border: 1px solid #ccc; padding: 6px;">
                                          <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/5.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 5:  Pre+diapin - Predicted structure.</div>
                                     </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/8.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 6:  Colour Legend - Predicted structures.</div>
                                     </div>
                                  `,
                                  build: `
                                  <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/9.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 7:  PLASMID</div>
                                     </div>
                                    The different constructs mentioned in the previous table were introduced in the “Mod SCR-D” section of the plasmid, which was ordered to be synthesised by Genscript.
                                    The design of the plasmid includes a Dual-Luciferase reporter system, by which the level of the second luciferase (Firefly), is expressed due to the presence of readthrough. 
                                    This way we can determine the readthrough rate by comparing the expression of the first luciferase (Renilla) and the second luciferase (Firefly). Two T2A peptides flank the Mod SCR-D,
                                     so that the final Luciferase peptides’ signals are not affected by its presence or each other. 
                                    Upon receiving the plasmid, we verified its sequence with Sanger sequencing and amplified the plasmid sample. 

                                    <br><br>
                                    
                                  `,
                                  test: `
                                    Constructs were transfected into HEK293 human cells, and cultivated. 
                                    We then analysed Renilla and Firefly Luciferases’ reporter levels using the Dual-Luciferase® Reporter Assay System from Promega.
                                    <br>
                                    We compared the 3 modified SCR-D to the “Natural” (unchanged) SCR-D sequence by comparing the expression ratios of Renilla and Firefly for each of the samples.
                                    <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/scr-d-readthrough-analysis.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 8: The results show highest readthrough levels in the Natural SCR-D (~9%), followed closely by 
                                         the Mutated Diapin sequence (~8%). OnlyPrediapin has the third lowest readthrough ratio (~6%), whilst no-hypopin has the lowest (~5%).
</div>
                                     </div>
                                    `,
                                  learn: `
                                    <p>Our testing device has been able to identify <b>readthrough level fluctuations</b> between the different <b>SCR-D sequences</b>, facilitating the evaluation of their respective contribution.</p>
                                        
                                    <p>The <b>Only Pre-Diapin</b> sequence holds a key role in the <b>readthrough induction</b> by SCR-D, which might explain its <b>high conservation</b>.</p>
                                        
                                    <p><b>Diapin’s maintained structure</b> allows a high upkeep of the readthrough rates, but the sequence change lowers them slightly. This decrease could explain the high conservation of the Diapin’s sequence.</p>
                                        
                                    <p>Despite its lower overall conservation, the <b>Hypopin</b> has a significant role in the <b>induction of the readthrough</b>.</p>
                                        
                                    <p>The <b>No-Hypopin</b> sequence hints that the <b>Diapin</b> interferes with the <b>Pre-Diapin’s function</b>. This might mean that Diapin aids the readthrough only when it interacts with the Hypopin. Alternatively, it might have an intentionally <b>repressive function</b>, for evolutionary reasons.</p>
                                        
                                    <p>To further characterise these <b>structural elements</b> in future iterations of this design, more combinations of elements should be considered, to explore more <b>interactions between the regions</b> and their isolated roles.</p>
                                        
                                    <p>Overall, we observe a very high complexity in <b>SCR-D’s behaviour</b>, and it is worth studying it further.</p>
                                        
                                    <br>
                                        
                                    <p>Nevertheless, our work provides the <b>first functional dissection of SCR-D</b>, and generates a set of <b>three new readthrough elements</b> with three variable rates.</p>
                                        
                                    <br>
                                        
                                    <p><em>(Please note that these parts belong to our <b>STOP codon readthrough elements library</b> and that they have not been published to the iGEM registry to protect their intellectual property.)</em></p>
                                        `,

 
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
                                design: `or this first iteration, we attempted to design an inducible SCR by fusing the SCR-D sequence to the theophylline aptamer [5]. 
                                        Our hypothesis was that we could create an ON/OFF system by disrupting a key functional structure of the SCR-D element with the aptamer.`,
                                build: 'We joined the theophylline aptamer with the SCR-D element and designed an ON/OFF configuration in which the Diapin structure was disrupted.',
                                test: ` We used the test in cycle 1.2.3, to observe the structural and behavioral complexity of SCR-D and determine whether we could reliably design 
                                        an ON/OFF configuration by disrupting SCR-D’s predicted structure. `,
                                learn: `As established in the Cycle  Identification of key structural elements, Iteration 3, Learn phase,
                                        , the structural and behavioural complexity of SCR-D is very high, 
                                        especially due to possible interactions between the identified regions.
                                         We believe it needs further characterisation to become a reliable 
                                         candidate for a SCR-D swich, and that disrupting the Diapin might
                                          not result in a high readthrough level modulation, generating a very 
                                          weak swich. We should explore the possibility of a different STOP
                                           codon readthrough element that has been better characterised
                                            structurally and experimentally to design a modulable readthrough
                                             element.
`
                            }
                        },
                        {
                            name: 'Selecting a New SCR Element (SECIS)',
                            phases: {
                                design: `Based on the failure of SCR-D, we searched for a new SCR element whose function was strictly dependent on its secondary structure. The SECIS element 
                                                (SElenoCysteine Insertion Sequence) [3] was a promising candidate because its function in translational regulation is directly linked to its secondary and tertiary structure.
                                                 We hypothesized that we could create an ON/OFF system by disrupting the SECIS structure with a ligand-responsive aptamer.`,
                                build: 'We searched for information about known SECIS elements and began the computational design of our constructs.',
                                test: `We consulted with an expert on SECIS elements, Dr. Copeland, to validate our approach. He confirmed that the SECIS element was a viable
                                            candidate and provided guidance on determining the experimental conditions necessary for our project.`,
                                learn: 'The expert consultation confirmed that a specific, well-characterized SECIS element was required to proceed with the experimental phase, leading to the next iteration.'
                            }
                        },
                        {
                            name: 'SECIS DIO2  Element',
                            phases: {
                                design: `We chose to focus on the SECIS element from the human DIO2 gene for our system [6]. 
                                        This specific SECIS was selected because its function is well-documented, and it is known to be a strong and stable element. 
                                        Our hypothesis was that by using a well-characterized element, we could increase the chances of creating a functional switch with predictable behavior.`,
                                build: `We built a construct containing only the DIO2 SECIS element, isolated from the rest of the system.
                                        <br>
                                         We built a plasmid with a Dual-Luciferase reporter system, where a STOP codon impedes the translation 
                                         of the second luciferase (Firefly) unless readthrough occurs. This way we can determine the readthrough rate 
                                         by comparing the expression of the first luciferase (Renilla) and the second luciferase (Firefly). The SECIS DIO2 e
                                         lement is found in the 3’-UTR region of the Dual-Luciferase translational unit. Two T2A peptides separate Firefly 
                                         and Renilla luciferases to prevent interfering expression signals.
                                         <div class="image-container" style="text-align: center; margin: 20px auto;">
                                     <img src="https://static.igem.wiki/teams/5622/images/engineering/11.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 9: SECIS plasmid.
                                        </div>
                                     </div>`,
                                test: `Testing of the SECIS DIO2 element was performed in both HEK-293T cells and in cell-free 
                                        reticulocyte assays using the Dual-Luciferase® Reporter Assay System from Promega.
                                        We were able to detect readthrough levels in both circumstances, and optimised experimental conditions. Further details can be found in the Wet Lab section.`,
                                learn: ` Results suggest that the efficiency of our testing device for measuring 
                                            translational stop codon readthrough is high, and reliable. 
                                            We have observed the expected ratios of Renilla/Firefly Luciferases, 
                                                reaching 10% in HEK cells and 14.16% in cell-free systems. 
                                                We have been able to test the SECIS element under variable 
                                                circumstances, which has allowed us to optimise its induction 
                                                of readthrough, increasing Firefly expression. We are now 
                                                familiar with the normal behaviour of the SECIS element and
                                                 what it is responsive to, and this will allow us to better 
                                                 understand the behaviour of our swich. The success of 
                                                 the measurement device design will be considered to prepare
                                                  the swich device. 
                                            For further details regarding our published and characterised SECIS part, 
                                            please consult our Parts page or the registry:<a href="registry.igem.org/parts/bba-25ermnvd" target="_blank">BBa_25ERMNVD</a> 
                                        `
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
                                design: `The goal was to select a suitable aptamer to serve as our ligand-responsive component. We chose the theophylline aptamer as a candidate due to several key 
                                advantages documented in the literature: High specificity: It binds with high specificity to its ligand, theophylline. The binding affinity is 10,000-fold greater than for caffeine, 
                                a closely related molecule [7]. Synthetic ligand: Theophylline is not naturally found in mammalian cells [8]. It has also been previously used safely on HEK cells [9], which are highly 
                                relevant as these are the cells used for the experimental part of this project. Cross-system functionality: It has been shown to work in both prokaryotic [10] and eukaryotic [11] systems.
                                 Defined structure: Its secondary structure is well understood [12], simplifying its use in a structure-based design. Design flexibility: Multiple versions of the aptamer are available, allowing for optimisation.`,
                                build: 'We performed a thorough literature review to collect and analyze information on the theophylline aptamer\'s known properties and its behavior in different systems.',
                                test: 'We used the data from our literature review to evaluate the aptamer\'s potential for our project. This literature-based test confirmed that the aptamer was a viable candidate.',
                                learn: 'Our review revealed that not all versions of the aptamer were equally effective. The need for a robust and highly active variant became clear, which led us to the next iteration.'
                            }
                        },
                        {
                            name: 'Choosing the Theo-ON-5 Variant',
                            phases: {
                                design: `Building on the previous learning, we needed a highly effective and validated aptamer variant. After a thorough review, we chose the Theo-ON-5 variant [13]. 
                                        This specific aptamer was selected because it demonstrated the largest difference in frameshift percentage (the ON/OFF ratio) in a conceptually similar published study.
                                         We hypothesized that by using this robust and experimentally validated variant, we could maximize the efficiency of our synthetic switch. This swich’s inner workings rely on the 
                                         Frameshift’s function being caused by its structure. When theophylline binds to the aptamer, the aptamer’s structure changes, disrupting the Frameshift and therefore the Frameshift rates.`,
                                build: `We constructed a plasmid containing the Theo-ON-5 aptamer, linked to a -1 Programmed Ribosomal Frameshift Pseudoknot [13]. This Aptamer-Frameshift component is a ligand-responsive ON-ON RNA switch, and it will allow us to test the aptamer’s working conditions. The frameshift occurs when the aptamer binds its ligand (theophylline)
                                        This construct contains a Dual-Luciferase reporter system, where the second luciferase (Firefly) is only synthetised in the right frame when the frameshift occurs. Otherwise translation is terminated or Firefly is translated in the wrong coding frame. Two T2A peptides separate both luciferases from the aptamer+frameshift switch and each other to prevent interfering expression signals.
                                        This measurement device will allow us to test the aptamer’s efficiency and determine its optimal conditions, as well as whether its documented functionality is experimentally replicable. 
                                        <div class="image-container" style="text-align: center; margin: 20px auto;">
                                        <img src="https://static.igem.wiki/teams/5622/images/engineering/10.webp" alt="AlphaFold2 Pipeline Design">
                                         <div class="photo-caption">Figure 10: Plasmid FS+Apt.
                                        </div>`,
                                test: `
                                    <p>We have tested the <b>Aptamer + Frameshift construct</b> in our measurement device, and have successfully observed a <b>variable Frameshift rate</b> in presence and absence of theophylline, indicating that the <b>swich works as expected</b>.</p>

                                    <p>We have optimised the <b>experimental conditions</b> to obtain maximal frameshift rates. For further details, please consult our <a href="#wetlab" class="internal-ref">Wet Lab page</a> or our registry parts:</p>

                                    <ul>
                                      <li><a href="registry.igem.org/parts/bba-25m42989" target="_blank">BBa_25M42989</a></li>
                                      <li><a href="registry.igem.org/parts/bba-257j2532" target="_blank">BBa_257J2532</a></li>
                                      <li><a href="registry.igem.org/parts/bba-258lw76f" target="_blank">BBa_258LW76F</a></li>
                                    </ul>
                                    `,

                                learn: 'We have successfully confirmed the Theo-ON-5 aptamer’s conformational change in presence and absence of its ligand, and have optimised the testing conditions for our measurement device.'
                            }
                        }
                    ]
                },
        3: {
                    name: 'SCR switch',
                    iterations: [
                        {
                            name: 'Design and testing of the SCR switch',
                            phases: {
                                design: `
                                <p>To design a <b>STOP-codon readthrough swich</b>, we developed a <b>model and software</b> to calculate optimal energies of <b>ON</b> and <b>OFF</b> states. In essence, the <b>OFF state structure</b> of the swich needs to be <b>more stable (lower energy values)</b> than the ON state structure without the ligand. However, the addition of the ligand makes the <b>ON structure</b> more stable. For further details on these concepts, please consult our <b>Model</b> page.</p>
                                    
                                <p>Our swich is composed of the previously tested parts of this branch: the <b>Theo-ON-5 aptamer</b> and the <b>SECIS DIO2 element</b>. The sequences of these elements were run through our software, <b>TADPOLE</b>, which outputted a variable set of linkers and swich structures. Thanks to our model, we were able to discriminate the <b>most energetically optimal candidates</b> that met our conditions.</p>
                                    
                                <p>It is important to note that, during the design of these swiches, we noticed <b>inaccuracies in the structural foldings</b> of the SECIS element:</p>
                                    
                                <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/21.webp" alt="SECIS theoretical vs RNAFold prediction">
                                  <div class="photo-caption">Figure 11: SECIS theoretical structure vs that predicted by RNAFold.</div>
                                </div>
                                    
                                <p>On the left is depicted the <b>secondary structure of SECIS DIO2</b>, extracted from the <b>SelenoDB</b> database. This is the most reality-accurate depiction of the SECIS structure, confirmed experimentally. On the right is the <b>prediction generated by RNAFold</b> of the SECIS DIO2 structure. The <b>key nucleotides</b> for SECIS’ induction of readthrough activity are marked in <span style="color:green; font-weight:bold;">green</span>.</p>
                                    
                                <p>What we observed is that <b>RNAFold was unable to recreate the real structure</b> of SECIS DIO2 — the main difference lying in its inability to form <b>non-canonical pairings</b>. The <span style="color:gold;">yellow arrows</span> point to non-canonical pairings RNAFold is unable to predict, whilst the <span style="color:purple;">purple arrow</span> refers to pairings RNAFold predicts despite not being present in the original structure. Importantly, we observed that RNAFold <b>disrupts the structure of three key pairings</b> for SECIS’ function.</p>
                                    
                                <p>Despite this, we assumed RNAFold was generating reality-accurate predictions of the SECIS structure, and proceeded to run <b>TADPOLE</b>. Due to this fact, we consider there could be <b>differences between the in silico prediction and the in vitro result</b>.</p>
                                    
                                <p>Using the predicted SECIS structure, we aimed to design an <b>ON–ON switch</b>: SECIS’ structure will be <b>less disrupted in the presence of the aptamer’s ligand</b>, and <b>more disrupted in its absence</b>.</p>
                                    
                                <p>We selected the <b>four most optimal swiches</b> calculated by TADPOLE, each with a variable <b>linker length</b>:</p>
                                    
                                <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/22.webp" alt="swich 1">
                                  <div class="photo-caption">Figure 12: Linker 5 state energies.</div>
                                </div>
                                    
                                <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/23.webp" alt="swich 2">
                                  <div class="photo-caption">Figure 13: Linker 7 state energies.</div>
                                </div>
                                    
                                <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/24.webp" alt="swich 3">
                                  <div class="photo-caption">Figure 14: Linker 8 state energies.</div>
                                </div>
                                    
                                <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/25.webp" alt="swich 4">
                                  <div class="photo-caption">Figure 15: Linker 9 state energies.</div>
                                </div>
                                    
                                <p>It is worth noting that the <b>SECIS sequence bound to linker 5</b> suffered some minor alterations so that a 5 bp linker could successfully disrupt SECIS’ structure. For further details, please consult our <b>Parts</b> page or our part registry:</p>
                                    
                                <ul>
                                  <li><a href="http://registry.igem.org/parts/bba-25tc7kvp" target="_blank">BBa_25TC7KVP</a></li>
                                  <li><a href="http://registry.igem.org/parts/bba-25zkod5q" target="_blank">BBa_25ZKOD5Q</a></li>
                                  <li><a href="http://registry.igem.org/parts/bba-25zne3g6" target="_blank">BBa_25ZNE3G6</a></li>
                                  <li><a href="http://registry.igem.org/parts/bba-25fu0lgz" target="_blank">BBa_25FU0LGZ</a></li>
                                </ul>
                                `,

                                
                                 build: `The device used to measure the readthrough ratios of the various swiches 
                                 is based on the device we used during branch 2, cycle 1, iteration 3. The device consists 
                                 of a Dual–Luciferase system, where a STOP codon is positioned before the second luciferase 
                                 (Firefly), impeding its translation. Using this device, Firefly is only expressed when a
                                  readthrough is induced. This allows us to measure fluctuations in the readthrough rate in 
                                  presence, and absence of the ligand. The swich is found after Firefly and the secondary 
                                  STOP codon, in the 3’-UTR region of the translational unit. Two T2A peptides separate Firefly
                                   and Renilla luciferases to prevent interfering expression signals.
                                   <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/11.webp" alt="swich 4">
                                  <div class="photo-caption">Figure 16: Switch device.</div>
                                </div>
                                   `,
                                
                                 test: `
                                 The Dual-Luficerase STOP codon readthrough measurement cassette was amplified by PCR and tested in a cell-free system using using the Dual-Luciferase® Reporter Assay System from Promega.
                                    Due to the structural predictions generated by RNA Fold of the disruption of SECIS, we were expecting an ON-ON swich, where the readthrough is active in presence of theophylline.
                                    The results showed readthrough modulability by theophylline responsiveness, but by an OFF-ON swich model, where in absence of theophylline the readthrough is active. 
                                  <br>
                                  Left column shows Firefly Luciferase levels, Right column shows Renilla Luciferase levels, and the middle column shows the readthrough rates. The top two rows belong to “Bad SECIS”, a cassette with the Dual-Luciferase translational unit that does not have a SECIS sequence on the 3’-UTR region. It is our negative readthrough control. The bottom two rows belong to “Good SECIS”, a cassette with the same construct as in Branch 2, Cycle 1, Iteration 3. It is our positive readthrough control.
                                    <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/controls-for-linkers-celfree.webp" alt="swich 4">
                                  <div class="photo-caption">Figure 17: Results image 1.</div>
                                </div>
                                <br>
                                  Left column shows Renilla Luciferase levels, middle column shows Firefly Luciferase levels, and the right column shows the readthrough rates. The top row belongs to our positive control, “Good SECIS”. The four rows below, in order are: swich with linker 5, swich with linker 7, swich with linker 8, and swich with linker 9.
                                    <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/final-linkers-all-beautified.webp" alt="swich 4">
                                  <div class="photo-caption">Figure 18: Results image 2.</div>
                                </div>

                                <div class="image-container" style="text-align: center; margin: 20px auto;">
                                  <img src="https://static.igem.wiki/teams/5622/images/engineering/26.webp" alt="swich 4">
                                  <div class="photo-caption"> Figure 19: SCR switch constructs and controls.</div>
                                </div
                                 `,
                                
                                learn: `
                                <p>What we have observed is the <b>successful creation of a modulable STOP codon readthrough swich</b>, although it does not match the in silico predictions, as the swich has an <b>OFF–ON mechanism</b> instead of an ON–ON mechanism.</p>
                                    
                                <p>We can confirm that <b>SECIS’s function is not affected by theophylline presence</b>, meaning there is <b>no SECIS–theophylline interaction</b>. The positive readthrough control <b>“Good SECIS”</b> maintains its readthrough rate in both presence and absence of theophylline, demonstrating the lack of interaction between SECIS and theophylline.</p>
                                    
                                <p>We can determine that <b>theophylline interacts with the Theo-ON-5 aptamer</b>. Since theophylline does not interact with the “Good SECIS construct”, it can only interact with two regions of the swich: <b>the linker or the aptamer</b>. As the four linkers differ in sequence, and the same behavioural response to theophylline is observed in all the switches, we can confirm that the interaction is caused by <b>theophylline binding to the aptamer</b>, not the linker.</p>
                                    
                                <p>There is a <b>direct correlation between linker length and modulability</b> of the readthrough rate. The shorter the linker, the greater the difference between ON and OFF state readthrough rates. <b>Linker 5</b> shows the highest difference between states, while <b>Linker 0</b> has the smallest.</p>
                                    
                                <p>Our <b>Model and Software</b> were able to accurately calculate two <b>energetically interchangeable states</b>, as we observe that one structural sequence is preferred in theophylline absence (leading to <b>higher readthrough</b>), and another in its presence (leading to <b>lower readthrough</b>). Had their design been wrong, the same state would have been preferred in both conditions, and no modulation of the readthrough would have been observed.</p>
                                    
                                <p>Our <b>Model and Software</b> also successfully designed <b>linkers that interact with the SECIS sequence</b> to disrupt its secondary structure. Had there been no such interaction, no difference in readthrough levels would be observed.</p>
                                    
                                <p>We narrowed down possible reasons why the <b>in silico predictions don’t match the in vitro results</b>:</p>
                                    
                                <ul>
                                  <li><b>Further context interactions:</b> Presence of proteins, enzymes, and other oligonucleotides (molecular crowding, etc.) could influence transcript folding, causing discrepancies between in silico and in vitro results. We minimised this by testing in a <b>cell-free environment</b>, reducing external factors.</li>
                                    
                                  <li><b>Lack of accounting for dynamics:</b> RNAFold predicts <b>static structures</b> only. While SECIS likely has a preferred main state, dynamic transitions might be unaccounted for. However, we believe this effect is limited since we calculated ON and OFF states separately, considering aptamer–ligand binding status.</li>
                                    
                                  <li><b>Partial sequence limitation:</b> The predictions of the swich states were not based on the <b>entire mRNA transcript</b>. Complex interactions with other transcript regions might exist but were beyond our computational capacity to model.</li>
                                    
                                  <li><b>RNAFold accuracy trade-offs:</b> As discussed in the <b>Design</b> section, RNAFold cannot predict <b>non-canonical pairings</b> due to training limitations. Our <b>Functional RNA Element (FRE)</b>, SECIS, relies on these pairings for readthrough induction. The software prioritised candidates maintaining SECIS key pairings in the ON state, but RNAFold could only predict one of four key pairings. Thus, ON–ON candidate selection relied mainly on a <b>partial set of non-canonical interactions</b>. This likely explains why the <b>predicted swich behaviour diverged from experimental outcomes</b>.</li>
                                </ul>
                                    
                                <p>Having learned this, we can verify that our <b>Model and Software</b> enable <b>automatised design of RNA switch candidates</b> with high success rates — in our case, all four candidate designs functioned as swiches, marking a <b>100% success rate</b>. Limitations stem mainly from current <b>bioinformatic prediction tools</b> like RNAFold, which cannot fully represent RNA complexity.</p>
                                    
                                <p>Despite this, our software <b>efficiently narrows down potential candidates</b> and significantly <b>accelerates swich development</b>. Naturally, differences between in silico designs and in vitro tests are expected due to these constraints.</p>
                                    
                                <p>In future iterations, we plan to design <b>shorter linkers</b> to achieve higher readthrough differences between <b>ON–OFF</b> and <b>OFF–ON</b> states, and to test additional candidates to achieve a true <b>ON–ON switch</b>. We are also considering expanding our <b>Model and Software</b> to include <b>non-canonical pairing recognition</b>, and to positively score those that contribute to the swich’s function.</p>
                                `,
 
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