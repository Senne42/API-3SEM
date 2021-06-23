package com.grupo2.API_TraceFinder.repository;

import com.grupo2.API_TraceFinder.classes.Arquivo;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArquivoRepository extends JpaRepository<Arquivo, Long>
{
	//Pesquisa de revisões do documento
	@Query(value = "SELECT arquivo_revisao"
			+ "	FROM arquivo "
			+ " INNER JOIN codelist ON codelist.codelist_id = arquivo.codelist_id "
			+ " INNER JOIN documento ON documento.documento_id = codelist.documento_id "
			+ " WHERE documento.documento_id = ?1 GROUP BY arquivo_revisao ORDER BY arquivo_revisao;", nativeQuery = true)
	List selectRevisoes(Long docid);
	
	
	/*
	@Query(value = "SELECT lep_revisao"
			+ "	FROM lep "
			+ " WHERE documento_id = ?1 GROUP BY lep_revisao ORDER BY lep_revisao;", nativeQuery = true)
	List selectRevisoes(Long docid);
	
	//Pesquisa da maior revisão do documento
	@Query(value = "SELECT MAX(arquivo_revisao) "
			+ "	FROM arquivo "
			+ " INNER JOIN codelist ON codelist.codelist_id = arquivo.codelist_id "
			+ " INNER JOIN documento ON documento.documento_id = codelist.documento_id "
			+ " WHERE documento.documento_id = ?1 ;", nativeQuery = true)
	String selectRevisoes(Long docid);*/
	
	@Query(value = "SELECT arquivo_caminho"
			+ "	FROM arquivo "
			+ " WHERE codelist_id = ?1 ", nativeQuery = true)
	String selectArquivoCaminho(Long blocoid);
	
	@Query(value = "SELECT arquivo_id, arquivo_nome, codelist_id, arquivo_revisao, arquivo_caminho"
			+ "	FROM arquivo "
			+ " WHERE codelist_id = ?1 ;", nativeQuery = true)
	List<Arquivo> selectArquivos(Long blocoid);
	
	
	  @Modifying
	  @Transactional
	  @Query(value = "DELETE FROM arquivo WHERE codelist_id = ?1", nativeQuery = true)
	  void deleteBlocoId(Long blocoid);
	
	
}
